import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


type ChatRole = "user" | "assistant"
type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = 
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>God mode</h1>
    </>
  )
}

export default App
