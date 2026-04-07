export default function Background() {
  return (
    <div className="global-bg" aria-hidden="true">
      {/* Moving gradients */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Perspective grid overlay */}
      <div className="bg-grid" />
      
      {/* Floating particles background */}
      <div className="bg-particles" />

      {/* 5 roaming blur orbs */}
      <div className="bg-orb-roam-1" />
      <div className="bg-orb-roam-2" />
      <div className="bg-orb-roam-3" />
      <div className="bg-orb-roam-4" />
      <div className="bg-orb-roam-5" />
      
      {/* Dark vignette to focus center */}
      <div className="bg-vignette" />
    </div>
  )
}
