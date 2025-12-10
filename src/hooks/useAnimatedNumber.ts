import { useState, useEffect } from 'react'

interface UseAnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
}

export function useAnimatedNumber({ value, duration = 600, decimals = 2 }: UseAnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayValue === value) return

    setIsAnimating(true)
    const startValue = displayValue
    const difference = value - startValue
    const steps = 60 // 60 frames for smooth animation
    const stepDuration = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function: ease-out-cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + difference * easeProgress

      setDisplayValue(parseFloat(currentValue.toFixed(decimals)))

      if (currentStep >= steps) {
        setDisplayValue(value)
        setIsAnimating(false)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, displayValue, duration, decimals])

  return { displayValue, isAnimating }
}
