export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Light mode: Bright white base for excellent readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#FFFCFA] to-[#FFF9F5] dark:from-[#0F0E0A] dark:via-[#1A1814] dark:to-[#2D2620]" />
      
      {/* Top-left: Subtle warm amber gradient orb */}
      <div className="absolute top-[-8%] left-[-8%] w-[850px] h-[850px] bg-gradient-to-br from-amber-200/15 via-orange-100/8 to-transparent rounded-full blur-[110px] dark:from-amber-600/20 dark:via-orange-800/10" />
      
      {/* Top-right: Subtle cool teal gradient orb */}
      <div className="absolute top-[5%] right-[-15%] w-[950px] h-[950px] bg-gradient-to-bl from-teal-100/12 via-cyan-50/8 to-transparent rounded-full blur-[130px] dark:from-teal-700/15 dark:via-cyan-900/10" />
      
      {/* Bottom-left: Subtle warm gold gradient orb */}
      <div className="absolute bottom-[-12%] left-[15%] w-[800px] h-[800px] bg-gradient-to-tr from-yellow-100/12 via-amber-50/8 to-transparent rounded-full blur-[100px] dark:from-yellow-700/12 dark:via-amber-800/8" />
      
      {/* Bottom-right: Subtle cool purple accent orb */}
      <div className="absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-tl from-purple-100/10 via-indigo-50/6 to-transparent rounded-full blur-[95px] dark:from-purple-800/12 dark:via-indigo-900/8" />
      
      {/* Center radial glow for subtle depth */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full blur-[160px] dark:from-gray-700/10" />
      
      {/* Very subtle horizontal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/10 via-transparent to-teal-50/10 dark:from-orange-950/20 dark:via-transparent dark:to-teal-950/20" />
      
      {/* Ultra-subtle top to bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 dark:from-black/30 dark:via-transparent dark:to-black/40" />

      {/* Very subtle noise texture for texture depth */}
      <div className="absolute inset-0 opacity-[0.008] mix-blend-overlay dark:opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' seed=\'2\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />
    </div>
  )
}
