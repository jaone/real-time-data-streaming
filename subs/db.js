const Redis = require("ioredis");
const sql = require("mssql");
const cron = require("node-cron");
const SqlConfig = require("../config.js");

// Three different redis instances are defined as DB, Subscriber and Queue
const redisDB = new Redis({
  // Configurations we made so that the redis instance we use as a DB can run as a db
  appendOnly: true,
  appendfilename: 'my-aof-file.aof',
  save: "60 1",
  // The possible values are always, everysec, and no
  appendfsync: 'everysec',
});
const subscriber = new Redis;
const queue = new Redis;

// redisDB.config("set", "save", "60 1");
// redisDB.config("set", "appendonly", "yes");


const getDataEveryTuesdaysOn2_30 = async () => {

  // Cron job trigger to delete and resync redisDB with mssql every tuesday at 2:30
  await cron.schedule("30 2 * * 2", async () => {
  try {
    await sql.connect(SqlConfig);
    const { recordset } = await sql.query("SELECT * FROM buyorders");
    await redisDB.del("persistData")
    await redisDB.lpush("persistData", recordset);
  } catch (error) {}
  })
};

const subscribeToPublisher = () => {

  // Subscriber set to publisher
  subscriber.subscribe("publish-data", (err, count) => {
    if (err) console.error(err.message);
    console.log(`Subscribed to ${count} channels.`);
  });

  subscriber.on("message", async (channel, message) => {

    // Listening to the message from the publisher and queuing the incoming message
    await queue.lpush("queueBetweenDbToSubscriber", message);

    setInterval(async () => {
      
      // If there is a message in the queue, all messages are moved to the db with a loop
      const queueLength = await queue.llen("queueBetweenDbToSubscriber");

      if (queueLength > 0) {
        for (let index = 0; index < queueLength; index++) {
          const queueItem = await queue.rpop("queueBetweenDbToSubscriber");
          await redisDB.lpush("persistData", JSON.parse(queueItem));
        }
      }
    }, 1000);
  });
}

(() => {
  subscribeToPublisher()
  getDataEveryTuesdaysOn2_30();
})();
