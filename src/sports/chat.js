// Not a real analyzable sport — a sentinel entry so Chat can sit in the
// same tab bar and use the same `sport` state as everything else. App.jsx
// checks `sport.id === 'chat'` to render the chat page instead of the
// uploader.
export const CHAT_VIEW = {
  id: 'chat',
  label: 'Chat',
  icon: '💬',
  tagline: 'Ask general questions about getting better at any sport',
  liveMetrics: [],
}
