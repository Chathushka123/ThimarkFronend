import React from 'react';

// Shared design system for the WIP dashboards (floor + management) — one
// place for the palette, icons, and small presentational pieces so both
// screens stay visually identical instead of drifting apart.

// Slowly auto-scrolls an overflowing container back and forth (ping-pong)
// along one axis so wide/tall tables and charts stay readable without
// anyone touching them — used on the floor TV screen where no one is at
// the mouse. Reads scroll/client size live every frame instead of caching
// it, so it keeps working through data reloads/resizes without needing to
// restart. Pauses on hover/touch so it never fights a manual scroll.
export function useAutoScrollX(enabled, { axis = 'x', speed = 30, pauseMs = 900 } = {}) {
  const ref = React.useRef(null);
  const sizeProp = axis === 'y' ? 'scrollHeight' : 'scrollWidth';
  const clientProp = axis === 'y' ? 'clientHeight' : 'clientWidth';
  const positionProp = axis === 'y' ? 'scrollTop' : 'scrollLeft';

  React.useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let frame;
    let direction = 1;
    let paused = false;
    let pauseTimer;
    let lastTs = null;
    let hovering = false;

    const step = (ts) => {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const maxScroll = el[sizeProp] - el[clientProp];
      if (maxScroll > 0 && !hovering && !paused) {
        let next = el[positionProp] + direction * speed * dt;
        if (next >= maxScroll) {
          next = maxScroll;
          direction = -1;
          paused = true;
          pauseTimer = setTimeout(() => { paused = false; }, pauseMs);
        } else if (next <= 0) {
          next = 0;
          direction = 1;
          paused = true;
          pauseTimer = setTimeout(() => { paused = false; }, pauseMs);
        }
        el[positionProp] = next;
      }
      frame = requestAnimationFrame(step);
    };

    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });

    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(pauseTimer);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, [enabled, axis, sizeProp, clientProp, positionProp, speed, pauseMs]);

  return ref;
}

export const C = {
  page: '#e7eaef',
  surface: '#ffffff',
  border: '#e8eaee',
  ink: '#181b20',
  muted: '#6b7280',
  faint: '#9aa1ac',
  subtleBg: '#f7f8fa',
  success: '#1a9d5c',
  successBg: '#e9f9f0',
  successBorder: '#bdead2',
  danger: '#e0393e',
  dangerBg: '#fdeced',
  dangerBorder: '#f6c6c8',
  amber: '#dd9426',
  amberBg: '#fdf3e2',
  amberBorder: '#f3ddab',
  blue: '#2a78d6',
  blueBg: '#e9f1fc',
  orange: '#e06a34',
  orangeBg: '#fdece2',
};

// One distinct accent hue per section — purely for wayfinding/color energy
// (icon chip + a thin top border on the panel), separate from the status
// colors above which carry actual meaning inside the charts/badges.
export const ACCENT = {
  teams: '#4f46e5',
  output: '#0d9488',
  throughput: '#7c3aed',
  floor: '#c2185b',
  alerts: C.danger,
};

export const card = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: '14px',
  boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
};

export const section = { ...card, padding: '18px 20px' };
export const sectionCard = (accentColor) => ({ ...section, borderTop: `3px solid ${accentColor}` });

// One-time scoped CSS for the handful of things inline styles can't do
// (hover states, the refresh spinner). Prefixed "wfd-" to stay out of the
// way of the rest of the app.
export const styleSheet = `
  .wfd-hover { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
  .wfd-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08); border-color: ${C.border}; }
  .wfd-row:hover { background: ${C.subtleBg}; }
  .wfd-refresh:hover:not(:disabled) { background: ${C.subtleBg}; }
  .wfd-close:hover { background: ${C.subtleBg}; }
  .wfd-range-btn:hover { background: ${C.subtleBg}; }
  @keyframes wfd-spin { to { transform: rotate(360deg); } }
  .wfd-spin { animation: wfd-spin 0.9s linear infinite; }

  /* Kiosk/TV mode: hide the app chrome around the dashboard so a fullscreen
     browser view on a shop-floor TV shows nothing but the dashboard itself. */
  body.wfd-kiosk-mode #layoutSidenav_nav { display: none !important; }
  body.wfd-kiosk-mode .main-footer { display: none !important; }
`;

export function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function Icon({ children, size = 18, color = 'currentColor', strokeWidth = 2, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const IconLayers = (props) => (
  <Icon {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </Icon>
);

export const IconAlertTriangle = (props) => (
  <Icon {...props}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const IconRotateCcw = (props) => (
  <Icon {...props}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Icon>
);

export const IconBell = (props) => (
  <Icon {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

export const IconRefreshCw = (props) => (
  <Icon {...props}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </Icon>
);

export const IconChevronRight = (props) => (
  <Icon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

export const IconBarChart = (props) => (
  <Icon {...props}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </Icon>
);

export const IconActivity = (props) => (
  <Icon {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </Icon>
);

export const IconGrid = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

export const IconCalendar = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);

export const IconMaximize = (props) => (
  <Icon {...props}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </Icon>
);

export const IconMinimize = (props) => (
  <Icon {...props}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
  </Icon>
);

export const IconDownload = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

// Filled pill button for the Excel export action — green (success), separate
// from the outlined "Refresh" pill so the two don't compete visually.
export const exportButtonStyle = (disabled) => ({
  gap: '7px', padding: '8px 14px', borderRadius: '999px', border: 'none',
  background: C.success, color: '#fff', fontSize: '13px', fontWeight: 700,
  cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
  boxShadow: `0 4px 10px ${C.success}44`,
});

export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function efficiencyColor(pct) {
  if (pct >= 85) return { color: C.success, bg: C.successBg, border: C.success };
  if (pct >= 60) return { color: C.amber, bg: C.amberBg, border: C.amberBorder };
  return { color: C.danger, bg: C.dangerBg, border: C.dangerBorder };
}

const STAT_TONES = {
  success: { chip: C.success, bg: C.successBg, border: C.successBorder },
  danger: { chip: C.danger, bg: C.dangerBg, border: C.dangerBorder },
  amber: { chip: C.amber, bg: C.amberBg, border: C.amberBorder },
  neutral: { chip: '#64748b', bg: C.subtleBg, border: C.border },
};

export function StatCard({ label, value, tone, icon }) {
  const palette = STAT_TONES[tone] || STAT_TONES.neutral;
  return (
    <div style={{
      background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: '14px',
      padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '11px', background: palette.chip, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: `0 4px 10px ${palette.chip}55`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '23px', fontWeight: 800, color: C.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '11.5px', color: C.muted, marginTop: '4px', fontWeight: 600, letterSpacing: '0.01em' }}>{label}</div>
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, right, icon, accent, compact }) {
  const rgb = accent ? hexToRgb(accent) : null;
  const iconBox = compact ? 26 : 36;
  return (
    <div
      className="d-flex justify-content-between align-items-start"
      style={{ gap: '10px', flexWrap: 'wrap', marginBottom: compact ? '6px' : '12px', flexShrink: 0 }}
    >
      <div className="d-flex align-items-start" style={{ gap: compact ? '8px' : '12px' }}>
        {icon && (
          <div style={{
            width: `${iconBox}px`, height: `${iconBox}px`, borderRadius: compact ? '8px' : '10px', flexShrink: 0,
            background: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)` : C.subtleBg,
            color: accent || C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
        <div>
          {eyebrow && !compact && (
            <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: accent || C.faint, textTransform: 'uppercase', marginBottom: '2px' }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: compact ? '12.5px' : '15px', fontWeight: 700, color: C.ink }}>{title}</div>
          {subtitle && !compact && <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function EmptyState({ children }) {
  return <p style={{ color: C.faint, fontSize: '13px', margin: 0, padding: '8px 0' }}>{children}</p>;
}

export function Modal({ title, subtitle, onClose, children, maxWidth = '640px' }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10002, backgroundColor: 'rgba(16, 20, 26, 0.55)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: C.surface, borderRadius: '16px', width: '100%', maxWidth, maxHeight: '82vh',
          boxShadow: '0 20px 48px rgba(16, 24, 40, 0.22)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: C.ink }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="wfd-close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '20px', lineHeight: 1,
              width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
            }}
            title="Close"
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '18px 20px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Sequential shading: one hue, light -> dark by intensity. Every cell still
// prints its own number, so color is reinforcement, not the only carrier —
// no legend needed for a single-measure grid like this. `columns` is a
// generic label list (hours for the floor screen, calendar days for the
// management screen); `teams` items need `id`, `team_name`, and a `field`
// array aligned to `columns`.
export function TeamMetricHeatmap({
  title, columns, teams, field, color, autoScrollX = false,
}) {
  const rgb = hexToRgb(color);
  const max = teams.reduce((m, t) => Math.max(m, ...t[field]), 0);
  const scrollRef = useAutoScrollX(autoScrollX);

  return (
    <div>
      {title && <div style={{ fontSize: '12.5px', fontWeight: 700, color: C.ink, marginBottom: '8px' }}>{title}</div>}
      <div ref={scrollRef} style={{ overflow: 'auto', maxHeight: '320px', border: `1px solid ${C.border}`, borderRadius: '10px' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '11px', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{
                padding: '6px 12px', textAlign: 'left', color: C.faint, fontWeight: 600,
                position: 'sticky', top: 0, left: 0, zIndex: 2, background: C.surface, whiteSpace: 'nowrap',
                borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
              }}>Team</th>
              {columns.map((col, i) => (
                <th key={`${col}-${i}`} style={{
                  padding: '6px 6px', color: C.faint, fontWeight: 600, minWidth: '44px',
                  position: 'sticky', top: 0, zIndex: 1, background: C.surface,
                  borderBottom: `1px solid ${C.border}`,
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id}>
                <td style={{
                  padding: '5px 12px', fontWeight: 600, color: C.ink, whiteSpace: 'nowrap',
                  position: 'sticky', left: 0, zIndex: 1, background: C.surface, borderRight: `1px solid ${C.border}`,
                }}>{t.team_name}</td>
                {t[field].map((v, idx) => {
                  const alpha = v <= 0 ? 0.04 : 0.15 + 0.75 * Math.min(1, v / (max || 1));
                  const textColor = alpha > 0.55 ? '#fff' : C.ink;
                  return (
                    <td
                      key={idx}
                      title={`${t.team_name} · ${columns[idx]} · ${v} units`}
                      style={{
                        padding: '7px 4px', textAlign: 'center',
                        background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
                        color: textColor, border: `1px solid ${C.subtleBg}`,
                      }}
                    >
                      {v > 0 ? v : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
