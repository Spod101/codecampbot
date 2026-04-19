interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export default function PanelHeader({ eyebrow, title, subtitle, right }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '6px' }}>
          {eyebrow}
        </p>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#cfd5dd', lineHeight: 1.2, margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>{subtitle}</p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0, paddingTop: '2px' }}>{right}</div>}
    </div>
  )
}
