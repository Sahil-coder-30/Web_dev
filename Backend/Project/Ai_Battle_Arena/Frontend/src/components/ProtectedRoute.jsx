import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/Auth/auth.context.jsx'
import { Skeleton, SkeletonList } from './Skeleton/Skeleton.jsx'
import '../features/Arena/styles/arena.scss'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="arena-layout">
        <aside className="arena-sidebar" style={{ padding: '24px' }}>
           <Skeleton type="title" style={{ width: '80%' }} />
           <Skeleton type="text" style={{ marginTop: '24px' }} />
           <Skeleton type="text" />
           <Skeleton type="text" />
           <Skeleton type="text" style={{ marginTop: 'auto' }} />
        </aside>
        <main className="arena-main">
          <Skeleton type="title" style={{ width: '30%', height: '40px' }} />
          <Skeleton type="text" style={{ width: '50%', marginBottom: '40px' }} />
          
          <SkeletonList count={3} type="row" style={{ height: '100px', borderRadius: '4px', background: 'var(--surface-high)', border: '1px solid rgba(72,71,77,0.3)' }} />
        </main>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
