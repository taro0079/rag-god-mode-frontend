import "./App.css"
import { Chat } from "./chat/Chat"

function App() {
  return (
    <div className="app-shell">
      <div className="center-panel">
        <h1 className="app-title">God mode</h1>
        <div className="chat-panel">
          <Chat title="AI Chat" />
        </div>
      </div>
    </div>
  )
}

export default App
