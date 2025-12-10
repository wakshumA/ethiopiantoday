export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Clean white base with subtle blue tint */}
      <div className="absolute inset-0 bg-[#F0F9FF]" />
      
      {/* Sky blue gradient mesh orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 via-sky-200/30 to-transparent rounded-full blur-[100px]" />
      <div className="absolute top-[10%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-bl from-cyan-200/30 via-blue-100/25 to-transparent rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[20%] w-[700px] h-[700px] bg-gradient-to-tr from-sky-300/25 via-blue-200/20 to-transparent rounded-full blur-[90px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-cyan-300/20 via-sky-200/15 to-transparent rounded-full blur-[80px]" />
      
      {/* Additional soft blue warmth */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-blue-100/10 to-transparent rounded-full blur-[150px]" />
      
      {/* Very subtle overlay for cohesiveness */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0F9FF]/60 via-transparent to-[#F0F9FF]/40" />

      {/* Ultra-subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.012] mix-blend-overlay" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />
    </div>
  )
}
