import { useEffect, useId, useRef, useState } from 'react'
import { findAnswer, SUGGESTED_QUESTIONS } from '../lib/chatKnowledge'
import './ChatPage.css'

const FALLBACK_ANSWER =
  "I don't have a good answer for that specific one yet — try rephrasing, or ask about warm-ups, rest, nutrition, mental focus, injury prevention, or technique for golf, basketball, baseball, soccer, or football."

let nextId = 1
function makeId() {
  return nextId++
}

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: makeId(),
      role: 'bot',
      text: "Hey! Ask me a general question about training or getting better at any sport — or tap one of the suggestions below.",
    },
  ])
  const [input, setInput] = useState('')
  const inputId = useId()
  const listRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    const match = findAnswer(trimmed)
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: 'user', text: trimmed },
      { id: makeId(), role: 'bot', text: match ? match.answer : FALLBACK_ANSWER },
    ])
    setInput('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-top">
          <svg viewBox="0 0 100 100" className="chat-robot" aria-hidden="true">
            <line x1="50" y1="8" x2="50" y2="20" className="cr-line" />
            <circle cx="50" cy="6" r="4" className="cr-fill" />
            <rect x="18" y="20" width="64" height="52" rx="14" className="cr-outline" />
            <line x1="18" y1="40" x2="8" y2="40" className="cr-line-thin" />
            <line x1="82" y1="40" x2="92" y2="40" className="cr-line-thin" />
            <circle cx="38" cy="46" r="6" className="cr-fill" />
            <circle cx="62" cy="46" r="6" className="cr-fill" />
            <rect x="34" y="58" width="32" height="6" rx="3" className="cr-fill" />
          </svg>
          <h2 className="chat-title">Coach Cameron</h2>
        </div>
        <p className="chat-disclaimer">
          Answers come from a curated set of general training tips, not a live AI — for open-ended coaching, this is
          a starting point, not a substitute for a real coach.
        </p>
      </div>

      <div className="chat-list" ref={listRef}>
        {messages.map((message) => (
          <div key={message.id} className={`chat-bubble chat-bubble-${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>

      <div className="chat-suggestions">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button type="button" key={q} className="chat-suggestion" onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Ask a question
        </label>
        <input
          id={inputId}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about training or technique…"
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
