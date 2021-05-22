import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
const useCd = () => {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })
  const syncTransform = (wrapper, inner) => {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = 
    wrapperTransform === 'none'
    ? innerTransform : innerTransform.concat('', wrapperTransform)
  }
  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
export default useCd
