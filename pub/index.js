const Redis = require("ioredis");
const cron = require("node-cron");
const sql = require("mssql");

const data = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  images: [
    "https://i.dummyjson.com/data/products/1/1.jpg",
    "https://i.dummyjson.com/data/products/1/2.jpg",
    "https://i.dummyjson.com/data/products/1/3.jpg",
    "https://i.dummyjson.com/data/products/1/4.jpg",
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  ],
};

const redis = new Redis();

(() => {
  // A cron job running every minute
  cron.schedule("* * * * * *", async () => {
    try {
      // await sql.connect(SqlConfig);

      // Pulling data from mssql in the last minute
      // const {recordset} = await sql.query("SELECT * FROM buyorders WHERE ResultDate >= DATEADD(minute, -1, GETDATE())")

      // Stringify the incoming data and transfer it to the redis instance used as a publisher
      await redis.publish("publish-data", JSON.stringify(data));
    } catch (error) {
      console.log({ error });
    }
  });
})();
