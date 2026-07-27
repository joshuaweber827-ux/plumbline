import './SportTabs.css'

export function SportTabs({ sports, activeId, onSelect }) {
  return (
    <div className="sport-tabs" role="tablist">
      {sports.map((sport) => (
        <button
          key={sport.id}
          type="button"
          role="tab"
          aria-selected={sport.id === activeId}
          className={`sport-tab ${sport.id === activeId ? 'is-active' : ''}`}
          onClick={() => onSelect(sport)}
        >
          <span className="sport-tab-icon" aria-hidden="true">
            {sport.icon}
          </span>
          {sport.label}
        </button>
      ))}
    </div>
  )
}
