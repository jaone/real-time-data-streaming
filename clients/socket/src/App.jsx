import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import './App.css'

const socket = io('localhost:3501')

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })
    socket.on('message', data => {
      setLastMessage(data)
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('message')
    }
  }, [])

 

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected: {'' + isConnected}</p>
        <p>Last message: {lastMessage || '-'}</p>
      </header>
    </div>
  )
}

export default App
