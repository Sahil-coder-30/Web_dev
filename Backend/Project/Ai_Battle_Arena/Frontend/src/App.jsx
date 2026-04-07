import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/Auth/auth.context.jsx'
import { ArenaProvider } from './features/Arena/arena.context.jsx'
import { SidebarProvider } from './features/Arena/context/sidebar.context.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Background from './components/Background.jsx'

import Login          from './features/Auth/pages/Login.jsx'
import Register       from './features/Auth/pages/Register.jsx'
import ArenaHome      from './features/Arena/pages/ArenaHome.jsx'
import BattleProgress from './features/Arena/pages/BattleProgress.jsx'
import BattleResults  from './features/Arena/pages/BattleResults.jsx'
import BattleHistory  from './features/History/pages/BattleHistory.jsx'
import BattleDetail   from './features/History/pages/BattleDetail.jsx'
import Leaderboard    from './features/Leaderboard/pages/Leaderboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ArenaProvider>
          <SidebarProvider>
            <Background />
            <Routes>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/"            element={<ArenaHome />} />
                <Route path="/battle"      element={<BattleProgress />} />
                <Route path="/results"     element={<BattleResults />} />
                <Route path="/history"          element={<BattleHistory />} />
                <Route path="/history/:id"      element={<BattleDetail />} />
                <Route path="/leaderboard"      element={<Leaderboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SidebarProvider>
        </ArenaProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
