import "./App.css"
import { Chat } from "./chat/Chat"

function App() {
  return (
    <div className="app-shell">
      <div className="center-panel">
        <h1 className="app-title">Rpst God</h1>
        <p>I'm God of Rpst, knows everything about Rpst.</p>
        <div className="chat-panel">
          <Chat title="AI Chat" />
        </div>
      </div>
    </div>
  )
}

export default App
