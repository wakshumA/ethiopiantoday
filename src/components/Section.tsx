import Link from 'next/link'

export default function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        {title && (
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
        )}
        {href ? (
          <Link href={href} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group">
            See all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
