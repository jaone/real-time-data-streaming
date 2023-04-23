import { useEffect, useState } from 'react'
import './App.css'


function App() {
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {
    const evtSource = new EventSource('http://localhost:3502/sse');
    evtSource.onmessage = (event) => {
      setLastMessage(event.data)
    };
    return () => {
      evtSource.close();
    }
  }, [])
 

  return (
    <div className="App">
      <header className="App-header">
        <p>Last message: {lastMessage || '-'}</p>
      </header>
    </div>
  )
}

export default App
