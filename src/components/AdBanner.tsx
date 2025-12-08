export default function AdBanner({ position }: { position: 'top' | 'sidebar' | 'bottom' | string }) {
  return (
    <div className="w-full border rounded-md p-4 text-center text-sm text-gray-600 dark:text-gray-300">
      Ad Space ({position}) — replace with Google AdSense code
    </div>
  )
}
