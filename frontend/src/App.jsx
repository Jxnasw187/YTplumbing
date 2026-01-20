import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Mic, Upload, Film, Music, Activity } from 'lucide-react'
import { cn } from './lib/utils'

// Components
import VoiceCloning from './components/voice/VoiceCloning'
import MaterialUpload from './components/materials/MaterialUpload'
import Generation from './components/generation/Generation'
import MusicLibrary from './components/music/MusicLibrary'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black text-white font-sans selection:bg-primary/30 relative overflow-hidden">
        {/* Ambient Background Mesh */}
        <div className="absolute top-[-20%] left-[-10%] size-[800px] bg-primary/20 rounded-full blur-[120px] opacity-40 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] size-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-30 pointer-events-none mix-blend-screen" />

        {/* Floating Sidebar */}
        <aside className="w-[280px] flex-shrink-0 m-4 rounded-3xl bg-surface/60 backdrop-blur-xl border border-white/10 flex flex-col z-20 shadow-2xl">
          <div className="p-8 pb-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Activity className="text-white size-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">
                AutoShorts
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Pro Studio</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-6">
            <NavItem to="/" icon={<Mic />} label="Voice Studio" />
            <NavItem to="/materials" icon={<Upload />} label="Materials" />
            <NavItem to="/generate" icon={<Film />} label="Generation" />
            <NavItem to="/library" icon={<Music />} label="Music Library" />
          </nav>

          <div className="p-6 pt-2">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-white/50 font-medium">Monthly Credits</p>
                <span className="text-xs font-bold text-white">150 / 500</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[35%] rounded-full shadow-[0_0_10px_rgba(10,132,255,0.5)]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 m-4 ml-0 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-2xl overflow-hidden relative z-10 shadow-2xl flex flex-col">
          <div className="flex-1 overflow-auto p-10 no-scrollbar">
            <Routes>
              <Route path="/" element={<VoiceCloning />} />
              <Route path="/materials" element={<MaterialUpload />} />
              <Route path="/generate" element={<Generation />} />
              <Route path="/library" element={<MusicLibrary />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
        isActive
          ? "bg-primary text-white shadow-lg shadow-primary/25 font-medium"
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 text-sm">{label}</span>
    </NavLink>
  )
}

export default App
