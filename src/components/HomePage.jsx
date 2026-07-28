import './HomePage.css'

const STEPS = [
  { step: '1', title: 'Upload', detail: 'Drop in a video of your swing, shot, kick, or throw.' },
  { step: '2', title: 'Detect', detail: 'Real pose detection tracks your body frame by frame, right in your browser.' },
  { step: '3', title: 'Get Feedback', detail: 'See checkpoints, real angles, and plain-language coaching tips.' },
]

const SOURCES = [
  {
    n: '1',
    title: 'Live pose detection',
    detail: 'MoveNet (TensorFlow.js) tracks 17 body keypoints frame by frame, run entirely in your browser.',
  },
  {
    n: '2',
    title: 'Biomechanical angle math',
    detail: 'Joint angles — elbow bend, knee bend, spine tilt, hip/torso rotation — computed directly from those keypoints.',
  },
  {
    n: '3',
    title: 'Self-referential comparisons',
    detail: "Checkpoints are compared against your own other checkpoints (e.g. posture at address vs. impact), not a generic stranger's \"ideal.\"",
  },
  {
    n: '4',
    title: 'Well-known coaching fundamentals',
    detail: 'Reference points like full extension at release, hip-shoulder separation, and a ~3:1 backswing-to-downswing tempo — widely taught concepts, not a single cited study.',
  },
  {
    n: '5',
    title: 'Motion-plausibility gating',
    detail: "If the detected motion doesn't look like a real swing, shot, kick, or throw, feedback is suppressed instead of guessed at.",
  },
]

export function HomePage({ sports, onSelectSport }) {
  return (
    <div className="home-page">
      <section className="home-intro">
        <h2 className="home-intro-title">Pick a sport to get started</h2>
        <p className="home-intro-detail">
          Real pose detection on your uploaded video, run entirely in your browser — checkpoints, angles, and
          coaching tips in return.
        </p>
      </section>

      <section className="home-steps">
        {STEPS.map((s) => (
          <div className="home-step" key={s.step}>
            <span className="home-step-number mono">{s.step}</span>
            <div>
              <h3 className="home-step-title">{s.title}</h3>
              <p className="home-step-detail">{s.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="home-sports">
        {sports.map((sport) => (
          <button type="button" key={sport.id} className="home-sport-card" onClick={() => onSelectSport(sport)}>
            <span className="home-sport-icon" aria-hidden="true">
              {sport.icon}
            </span>
            <span className="home-sport-label">{sport.label}</span>
            <span className="home-sport-blurb">{sport.blurb}</span>
          </button>
        ))}
      </section>

      <div className="home-footer">
        <section className="home-about">
          <h2 className="home-about-title">Who Made This</h2>
          <p className="home-about-detail">
            CoachCam was built by Josh and Jake — we're heading into junior year of high school together. We picked
            up golf recently and thought real pose-detection feedback on our swings would be genuinely useful, then
            figured the same idea could help with just about any sport — which is how Basketball, Baseball, Soccer,
            and Football ended up here too.
          </p>
        </section>

        <section className="home-sources">
          <h2 className="home-sources-title">What the Feedback Is Based On</h2>
          <ol className="home-sources-list">
            {SOURCES.map((s) => (
              <li className="home-source" key={s.n}>
                <span className="home-source-title">{s.title}</span>
                <span className="home-source-detail">{s.detail}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
