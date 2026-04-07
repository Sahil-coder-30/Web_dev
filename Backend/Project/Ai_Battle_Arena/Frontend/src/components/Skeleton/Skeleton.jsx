import './Skeleton.scss'

export function Skeleton({ className = '', style = {}, type = 'block' }) {
  // type can be: 'text', 'title', 'card', 'row', 'block'
  return (
    <div className={`skeleton skeleton-${type} ${className}`} style={style} />
  )
}

export function SkeletonList({ count = 5, type = 'row', className = '', style = {} }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} type={type} className={className} style={{...style, animationDelay: `${i * 0.1}s`}} />
      ))}
    </>
  )
}
