// Home / Dashboard screen
const { GlowIcon, GlowTheme } = window;

window.HomeScreen = function HomeScreen({ t, data, persona, onScan, onOpenProduct, setTab }) {
  const p = window.GLOW_DATA.personas[persona];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "16px 20px 120px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Greeting header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4 }}>
        <div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 13, color: t.inkMuted, letterSpacing: 0.4, textTransform: "uppercase" }}>
            {greeting}, {data.user.name.toLowerCase()}
          </div>
          <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 32, fontWeight: 400, color: t.ink, lineHeight: 1.1, marginTop: 4, letterSpacing: -0.5 }}>
            Your skin,<br/>
            <span style={{ fontStyle: "italic" }}>today.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 10px", borderRadius: 14, background: t.bgElevated, border: `1px solid ${t.hairline}` }}>
          <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 22, fontWeight: 500, color: t.green, lineHeight: 1 }}>{data.user.streak}</div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 9, color: t.inkMuted, letterSpacing: 0.8, textTransform: "uppercase" }}>day streak</div>
        </div>
      </div>

      {/* AI Analysis widget — hero card */}
      <div style={{
        background: t.bgElevated,
        borderRadius: 28,
        padding: 22,
        border: `1px solid ${t.hairline}`,
        boxShadow: GlowTheme.shadow.soft,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* botanical orb */}
        <div style={{
          position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${t.greenSoft}, transparent 70%)`,
          opacity: 0.7,
        }}/>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.green, boxShadow: `0 0 0 4px ${t.greenSoft}` }}/>
            <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, color: t.green, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 600 }}>
              Today's analysis
            </div>
          </div>
          <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 22, lineHeight: 1.25, color: t.ink, letterSpacing: -0.2, marginBottom: 14 }}>
            {p.todayAnalysis}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {p.focus.map((f) => (
              <div key={f} style={{
                fontFamily: GlowTheme.font.sans, fontSize: 11, fontWeight: 500,
                padding: "5px 10px", borderRadius: 99, letterSpacing: 0.2,
                background: t.greenSoft, color: t.greenDeep,
              }}>{f}</div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            paddingTop: 12, borderTop: `1px solid ${t.hairline}`,
            fontFamily: GlowTheme.font.sans, fontSize: 12, color: t.inkSoft,
          }}>
            <GlowIcon name="weather" size={14} color={t.inkMuted}/>
            <span>{p.weather}</span>
          </div>
        </div>
      </div>

      {/* Expiry alert */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <GlowIcon name="bell" size={15} color={t.warn}/>
            <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 12, color: t.ink, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 600 }}>
              Expiring soon
            </div>
          </div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, color: t.inkMuted }}>2 items</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.expiring.map((item) => {
            const pct = item.opened / item.total;
            return (
              <div key={item.id}
                onClick={() => onOpenProduct(item.id.replace("e","p"))}
                style={{
                  background: t.bgElevated,
                  borderRadius: 22,
                  padding: 14,
                  border: `1px solid ${t.hairline}`,
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  cursor: "pointer",
                }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                  background: `url(${item.img}) center/cover, ${t.bgSubtle}`,
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 10, color: t.inkMuted, letterSpacing: 0.6, textTransform: "uppercase" }}>{item.brand}</div>
                  <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 16, color: t.ink, marginTop: 1, marginBottom: 8, fontWeight: 500, letterSpacing: -0.1 }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: t.warnSoft, overflow: "hidden" }}>
                      <div style={{ width: `${pct * 100}%`, height: "100%", background: t.warn, borderRadius: 2 }}/>
                    </div>
                    <div style={{ fontFamily: GlowTheme.font.mono, fontSize: 10, color: t.warn, fontWeight: 600 }}>
                      {item.daysLeft}d
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly insight chart */}
      <div style={{
        background: t.bgElevated, borderRadius: 22, padding: 18,
        border: `1px solid ${t.hairline}`,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, color: t.inkMuted, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 600 }}>
              Skin score · 7 days
            </div>
            <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 30, color: t.ink, fontWeight: 400, marginTop: 2, letterSpacing: -0.5 }}>
              85<span style={{ fontSize: 16, color: t.inkMuted }}>/100</span>
            </div>
          </div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, fontWeight: 600, color: t.green, padding: "4px 10px", borderRadius: 99, background: t.greenSoft }}>
            ↑ 4.2%
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 6, height: 70 }}>
          {data.insights.map((d, i) => (
            <div key={d.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "100%", height: `${(d.score / 100) * 58}px`,
                background: i === data.insights.length - 1 ? t.green : t.greenSoft,
                borderRadius: 6,
              }}/>
              <div style={{ fontFamily: GlowTheme.font.mono, fontSize: 9, color: t.inkMuted, letterSpacing: 0.5 }}>
                {d.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div onClick={() => setTab("routine")} style={{
          background: t.bgElevated, borderRadius: 18, padding: 14,
          border: `1px solid ${t.hairline}`, cursor: "pointer",
        }}>
          <GlowIcon name="sun" size={18} color={t.warn}/>
          <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 17, color: t.ink, marginTop: 10, fontWeight: 500 }}>Morning</div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, color: t.inkMuted, marginTop: 2 }}>2 of 6 done</div>
        </div>
        <div onClick={() => setTab("shelf")} style={{
          background: t.bgElevated, borderRadius: 18, padding: 14,
          border: `1px solid ${t.hairline}`, cursor: "pointer",
        }}>
          <GlowIcon name="shelf" size={18} color={t.green}/>
          <div style={{ fontFamily: GlowTheme.font.serif, fontSize: 17, color: t.ink, marginTop: 10, fontWeight: 500 }}>Shelf</div>
          <div style={{ fontFamily: GlowTheme.font.sans, fontSize: 11, color: t.inkMuted, marginTop: 2 }}>{data.shelf.length} products</div>
        </div>
      </div>
    </div>
  );
};
