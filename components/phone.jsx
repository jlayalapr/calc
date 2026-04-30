/* Phone — our own editorial bezel.
   Ignoring the iOS frame starter component since we want a cleaner, almost
   paper-like bezel that doesn't scream "iOS". Single rounded rect, dynamic
   island, home indicator.
*/

function Phone({ children, width = 392, height = 840, dark = false }) {
  return (
    <div style={{
      width, height, borderRadius: 52, overflow: 'hidden',
      position: 'relative',
      background: dark ? '#161513' : '#f7f2ea',
      boxShadow: '0 40px 80px rgba(26,18,6,0.12), 0 0 0 10px ' + (dark ? '#0b0a09' : '#eae3d3') + ', 0 0 0 11px rgba(26,18,6,0.12)',
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 118, height: 34, borderRadius: 24, background: '#0b0a09', zIndex: 50,
      }}/>
      <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, zIndex: 60,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 7, pointerEvents: 'none',
      }}>
        <div style={{
          width: 126, height: 4, borderRadius: 100,
          background: dark ? 'rgba(245,239,228,0.65)' : 'rgba(26,26,23,0.3)',
        }}/>
      </div>
    </div>
  );
}

Object.assign(window, { Phone });
