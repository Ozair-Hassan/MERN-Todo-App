/* eslint-disable react/prop-types */

const Pushpin = ({ color = '#6b7280', size = 30 }) => (
  <svg
    width={size}
    height={Math.round(size * 1.55)}
    viewBox="0 0 20 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.30))' }}
  >
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
      stroke="rgba(0,0,0,0.18)"
      strokeWidth="1"
      fill="none"
    />
    <ellipse
      cx="7.2"
      cy="6.8"
      rx="2.5"
      ry="1.9"
      fill="rgba(255,255,255,0.28)"
    />
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

const NoItemsFound = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      padding: '2rem',
    }}
  >
    {/* Sticky note */}
    <div
      style={{
        position: 'relative',
        width: '260px',
        background:
          'linear-gradient(to bottom, #9ca3af 0%, #9ca3af 11%, #e5e7eb 11%)',
        borderRadius: '2px',
        padding: '3rem 2rem 2.2rem',
        boxShadow:
          '4px 4px 10px rgba(0,0,0,0.18), 9px 9px 24px rgba(0,0,0,0.10)',
        transform: 'rotate(-2deg)',
        textAlign: 'center',
        fontFamily: 'var(--font-hand)',
      }}
    >
      {/* Dog-ear */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 26px 26px',
          borderColor: 'transparent transparent rgba(0,0,0,0.12) transparent',
        }}
      />

      {/* Pin */}
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
      >
        <Pushpin
          color="#6b7280"
          size={30}
        />
      </div>

      {/* Emoji */}
      <div style={{ fontSize: '3rem', marginBottom: '0.6rem', lineHeight: 1 }}>
        🔍
      </div>

      {/* Message */}
      <p
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#374151',
          lineHeight: 1.25,
          marginBottom: '0.5rem',
        }}
      >
        Nothing here yet!
      </p>
      <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.35 }}>
        No items match your criteria.
        <br />
        Try a different filter
      </p>

      <div
        style={{
          marginTop: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}
      >
        {[80, 65, 50].map((w, i) => (
          <div
            key={i}
            style={{
              height: '2px',
              width: `${w}%`,
              margin: '0 auto',
              background: 'rgba(156,163,175,0.5)',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
    </div>
  </div>
)

export default NoItemsFound
