import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useScrollParallax() {
  const sy = ref(0)
  function tick() { sy.value = window.scrollY }
  onMounted(() => {
    sy.value = window.scrollY
    window.addEventListener('scroll', tick, { passive: true })
  })
  onUnmounted(() => window.removeEventListener('scroll', tick))
  return sy
}

/**
 * Returns a computed that gives `{ transform: 'translate3d(0, Xpx, 0)' }`
 * based on the section's position relative to the viewport.
 * speed > 0 → background effect (plants lag behind content)
 */
export function parallaxStyle(sectionRef, sy, speed) {
  return computed(() => {
    sy.value
    if (!sectionRef.value) return {}
    const t = sectionRef.value.getBoundingClientRect().top
    return { transform: `translate3d(0, ${t * speed}px, 0)`, willChange: 'transform' }
  })
}
