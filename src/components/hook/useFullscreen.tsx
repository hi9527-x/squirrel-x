import { computed, onMounted, onUnmounted, ref } from 'vue'

import { cn } from '@/utils'

const fullClassName = cn(
  'pos-fixed! z-99999 left-0px top-0px',
  'w-100vw h-100vh overflow-auto'
)

export const useViewFullscreen = () => {
  const isFullscreen = ref(false)

  const className = computed(() => {
    if (isFullscreen.value) return fullClassName
    return ''
  })

  const toggle = (val = !isFullscreen.value) => {
    isFullscreen.value = val
  }

  const enter = () => {
    toggle(true)
  }

  const exit = () => {
    toggle(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      toggle(false)
    }
  }
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isFullscreen,
    enter,
    toggle,
    exit,
    className,
  }
}
