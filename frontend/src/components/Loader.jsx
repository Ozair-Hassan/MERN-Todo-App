/* eslint-disable react/prop-types */

const Pushpin = ({ color = '#dc2626', size = 30 }) => (
  <svg
    width={size}
    height={Math.round(size * 1.55)}
    viewBox="0 0 20 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pin head */}
    <circle
      cx="10"
      cy="9.5"
      r="8.5"
      fill={color}
    />
    <circle
      cx="10"
      cy="9.5"
      r="8.5"
      stroke="rgba(0,0,0,0.22)"
      strokeWidth="1"
      fill="none"
    />
    {/* Highlight */}
    <ellipse
      cx="7.2"
      cy="6.8"
      rx="2.6"
      ry="2"
      fill="rgba(255,255,255,0.32)"
    />
    {/* Needle */}
    <line
      x1="10"
      y1="18"
      x2="10"
      y2="31"
      stroke="#6b6b6b"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const Loader = () => (
  <div
    className="flex justify-center items-center fixed inset-0 z-50"
    aria-label="Loading"
  >
    {/* Sticky note that floats down */}
    <div
      className="note-float relative"
      style={{ width: '210px' }}
    >
      {/* Pin drops onto the note after it arrives */}
      <div
        className="pin-drop absolute left-1/2 z-10"
        style={{ top: '-14px', transform: 'translateX(-50%)' }}
      >
        <Pushpin
          color="#dc2626"
          size={30}
        />
      </div>

      {/* The note itself */}
      <div
        className="sticky-note sticky-yellow"
        style={{ padding: '2.8rem 2.2rem 2.2rem', textAlign: 'center' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2a1e08',
            marginBottom: '1.1rem',
            lineHeight: 1.1,
          }}
        >
          Loading&hellip;
        </p>

        {/* Pulsing dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#92400e',
                animation: `dotPulse 1.25s ease-in-out ${i * 0.26}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default Loader
