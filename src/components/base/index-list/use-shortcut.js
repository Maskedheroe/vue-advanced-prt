import { computed, ref } from 'vue'
export default function useShortcut (props, groupRef) {
  const ANCHOR_HERGHT = 18
  const scrollRef = ref(null)
  const touch = {}
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })
  const onShortcutTouchStart = (e) => {
    const anchorIndex = parseInt(e.target.dataset.index) // 拿到索引
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  const onShortcutTouchMove = (e) => {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HERGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }
  const scrollTo = (index) => {
    if (isNaN(index)) {
      return
    }
    // 需要限定index 
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }
  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
