import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * Composable qui suit la position de scroll verticale de la fenêtre.
 * L'écouteur est passif (`{ passive: true }`) pour ne pas bloquer le fil
 * principal et laisser le navigateur optimiser le rendu.
 *
 * @returns {import('vue').Ref<number>} sy — scrollY en pixels
 */
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
 * Calcule un style CSS de translation verticale pour l'effet parallaxe.
 * Utilise `getBoundingClientRect().top` (position relative au viewport)
 * plutôt que scrollY brut, ce qui rend l'effet relatif à l'entrée de la
 * section dans le viewport — pas à la position absolue dans la page.
 *
 * `translate3d` force le compositing GPU et évite les repaints.
 * `sy.value` est lu dans le computed uniquement pour déclencher la réactivité
 * Vue à chaque scroll (BoundingClientRect n'est pas réactif seul).
 *
 * speed > 0 → les décorations bougent moins vite que le contenu (lag visuel)
 *
 * @param {import('vue').Ref<HTMLElement|null>} sectionRef
 * @param {import('vue').Ref<number>}           sy    - depuis useScrollParallax()
 * @param {number}                              speed - facteur d'effet (0.1–0.3 typique)
 * @returns {import('vue').ComputedRef<{transform: string, willChange: string}|{}>}
 */
export function parallaxStyle(sectionRef, sy, speed) {
  return computed(() => {
    if (!sectionRef.value) return {}
    // getBoundingClientRect().top = absTop − scrollY
    // On dérive absTop en ajoutant sy.value, ce qui enregistre la dépendance
    // réactive au scroll, puis on soustrait sy.value pour retrouver la position
    // relative au viewport. Net : équivalent à rect.top, mais Vue re-calcule
    // cette computed à chaque changement de sy.
    const absTop = sectionRef.value.getBoundingClientRect().top + sy.value
    return { transform: `translate3d(0, ${(absTop - sy.value) * speed}px, 0)`, willChange: 'transform' }
  })
}
