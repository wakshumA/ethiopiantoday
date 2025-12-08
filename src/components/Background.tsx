export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Duck.design inspired: light cream/yellow base */}
      <div className="absolute inset-0 bg-[#FFFEF9] dark:bg-gradient-to-br dark:from-[#1a2942] dark:via-[#1e3a52] dark:to-[#244159]" />
      
      {/* Soft pastel gradient mesh orbs - duck.design style */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-yellow-200/40 via-amber-200/30 to-transparent rounded-full blur-[100px]" />
      <div className="absolute top-[10%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-bl from-orange-200/30 via-yellow-100/25 to-transparent rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[20%] w-[700px] h-[700px] bg-gradient-to-tr from-amber-300/25 via-yellow-200/20 to-transparent rounded-full blur-[90px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-orange-300/20 via-amber-200/15 to-transparent rounded-full blur-[80px]" />
      
      {/* Additional soft warmth */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-yellow-100/10 to-transparent rounded-full blur-[150px]" />
      
      {/* Very subtle overlay for cohesiveness */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFEF9]/60 via-transparent to-[#FFFEF9]/40 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Ultra-subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.012] dark:opacity-[0.02] mix-blend-overlay" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />

      {/* Dark mode elements */}
      <div className="hidden dark:block absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(6, 182, 212, 0.15) 49px, rgba(6, 182, 212, 0.15) 50px)',
          animation: 'gridSlide 20s linear infinite'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(16, 185, 129, 0.12) 49px, rgba(16, 185, 129, 0.12) 50px)',
          animation: 'gridSlide 25s linear infinite reverse'
        }} />
      </div>

      <div className="hidden dark:block absolute top-1/4 left-0 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-streak-1" />
      <div className="hidden dark:block absolute top-2/3 right-0 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-streak-2" />
      <div className="hidden dark:block absolute top-1/2 left-1/4 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-blue-300/25 to-transparent animate-streak-3" />
      <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
    </div>
  )
}
