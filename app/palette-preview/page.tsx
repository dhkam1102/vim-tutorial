export default function PalettePreview() {
  const palettes = [
    {
      name: 'A — Tokyo Night',
      desc: 'Cool lavender-blue. Modern, restrained, very Neovim community.',
      bg: '#1a1b26',
      surface: '#24283b',
      textPrimary: '#c0caf5',
      textSecondary: '#565f89',
      border: '#292e42',
      roles: [
        { label: 'accent', hex: '#7aa2f7' },
        { label: 'cyan', hex: '#7dcfff' },
        { label: 'success', hex: '#9ece6a' },
        { label: 'warning', hex: '#e0af68' },
        { label: 'error', hex: '#f7768e' },
        { label: 'purple', hex: '#bb9af7' },
      ],
    },
    {
      name: 'B — Catppuccin Mocha',
      desc: 'Warm mauve and peach on deep navy. The "riced terminal" favorite.',
      bg: '#1e1e2e',
      surface: '#313244',
      textPrimary: '#cdd6f4',
      textSecondary: '#6c7086',
      border: '#45475a',
      roles: [
        { label: 'accent', hex: '#cba6f7' },
        { label: 'teal', hex: '#94e2d5' },
        { label: 'success', hex: '#a6e3a1' },
        { label: 'warning', hex: '#f9e2af' },
        { label: 'error', hex: '#f38ba8' },
        { label: 'peach', hex: '#fab387' },
      ],
    },
    {
      name: 'C — Gruvbox Dark',
      desc: 'Retro amber and olive. The classic Vim colorscheme.',
      bg: '#282828',
      surface: '#3c3836',
      textPrimary: '#ebdbb2',
      textSecondary: '#665c54',
      border: '#504945',
      roles: [
        { label: 'accent', hex: '#fe8019' },
        { label: 'aqua', hex: '#83a598' },
        { label: 'success', hex: '#b8bb26' },
        { label: 'warning', hex: '#fabd2f' },
        { label: 'error', hex: '#fb4934' },
        { label: 'purple', hex: '#d3869b' },
      ],
    },
    {
      name: 'D — Nord',
      desc: 'Icy desaturated blues. Ultra-minimal, Scandinavian restraint.',
      bg: '#2e3440',
      surface: '#3b4252',
      textPrimary: '#eceff4',
      textSecondary: '#4c566a',
      border: '#434c5e',
      roles: [
        { label: 'accent', hex: '#88c0d0' },
        { label: 'blue', hex: '#81a1c1' },
        { label: 'success', hex: '#a3be8c' },
        { label: 'warning', hex: '#ebcb8b' },
        { label: 'error', hex: '#bf616a' },
        { label: 'purple', hex: '#b48ead' },
      ],
    },
  ]

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '48px 24px', fontFamily: '"JetBrains Mono", monospace' }}>
      <h1 style={{ color: '#e0e0e0', fontSize: '20px', fontWeight: 700, marginBottom: '40px', textAlign: 'center', letterSpacing: '0.05em' }}>
        Palette Options
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {palettes.map((p) => (
          <div key={p.name} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '8px', overflow: 'hidden' }}>
            {/* Title bar */}
            <div style={{ background: p.surface, borderBottom: `1px solid ${p.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.roles.find(r => r.label === 'error')?.hex, opacity: 0.8 }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.roles.find(r => r.label === 'warning')?.hex, opacity: 0.8 }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.roles.find(r => r.label === 'success')?.hex, opacity: 0.8 }} />
              <span style={{ color: p.textSecondary, fontSize: '11px', marginLeft: '8px' }}>vimTutorial</span>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Palette name */}
              <h2 style={{ color: p.textPrimary, fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{p.name}</h2>
              <p style={{ color: p.textSecondary, fontSize: '12px', marginBottom: '20px' }}>{p.desc}</p>

              {/* Background swatches */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'bg', hex: p.bg },
                  { label: 'surface', hex: p.surface },
                  { label: 'border', hex: p.border },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1 }}>
                    <div style={{ width: '100%', height: '32px', background: s.hex, borderRadius: '4px', border: `1px solid ${p.border}` }} />
                    <div style={{ color: p.textSecondary, fontSize: '10px', marginTop: '4px', textAlign: 'center' }}>{s.label}</div>
                    <div style={{ color: p.textSecondary, fontSize: '9px', textAlign: 'center', opacity: 0.7 }}>{s.hex}</div>
                  </div>
                ))}
              </div>

              {/* Text samples */}
              <div style={{ marginBottom: '20px', padding: '12px', background: p.surface, borderRadius: '4px', border: `1px solid ${p.border}` }}>
                <div style={{ color: p.textPrimary, fontSize: '14px', marginBottom: '4px' }}>Primary text on surface</div>
                <div style={{ color: p.textSecondary, fontSize: '12px', marginBottom: '8px' }}>Secondary text -- like a comment</div>
                <div style={{ color: p.textPrimary, fontSize: '13px' }}>
                  <span style={{ color: p.roles[0].hex }}>:wq</span>
                  <span style={{ color: p.textSecondary }}> | </span>
                  <span style={{ color: p.roles[5].hex }}>dd</span>
                  <span style={{ color: p.textSecondary }}> | </span>
                  <span style={{ color: p.roles[1].hex }}>ciw</span>
                  <span style={{ color: p.textSecondary }}> | </span>
                  <span style={{ color: p.roles[3].hex }}>3dw</span>
                </div>
              </div>

              {/* Accent swatches */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.roles.map((r) => (
                  <div key={r.label} style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: r.hex, borderRadius: '4px' }} />
                    <div style={{ color: p.textSecondary, fontSize: '9px', marginTop: '4px' }}>{r.label}</div>
                    <div style={{ color: p.textSecondary, fontSize: '8px', opacity: 0.7 }}>{r.hex}</div>
                  </div>
                ))}
              </div>

              {/* Mock button */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: p.surface,
                  border: `1px solid ${p.roles[0].hex}40`,
                  borderRadius: '4px',
                  color: p.roles[0].hex,
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  Start Learning →
                </span>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: p.roles[0].hex,
                  borderRadius: '4px',
                  color: p.bg,
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  Start Learning →
                </span>
              </div>

              {/* Mock progress bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: p.textSecondary, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</span>
                  <span style={{ color: p.textSecondary, fontSize: '10px' }}>12/40</span>
                </div>
                <div style={{ height: '3px', background: p.border, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '30%', background: p.roles[0].hex, borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
