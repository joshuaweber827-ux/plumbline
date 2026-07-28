// Not a real analyzable sport — a sentinel entry so Home can sit in the same
// tab bar and use the same `sport` state as everything else. App.jsx checks
// `sport.id === 'home'` to render the landing page instead of the uploader.
export const HOME_VIEW = {
  id: 'home',
  label: 'Home',
  icon: '🏠',
  tagline: 'Real pose-detection sports form analysis, right in your browser',
  liveMetrics: [],
}
