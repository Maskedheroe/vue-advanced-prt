import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser'

const useLyric = ({ songReady, currentLyric, currentTime }) => {
  const currentLineNum = ref(0)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric(currentLyric) // 切歌时为清理作用 
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''
    
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 做一个快速切换歌曲的保护逻辑
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric && songReady.value) {
      playLyric(currentLyric, currentTime)
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })
  const handleLyric = ({ lineNum, txt }) => {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric
  }
}
export const playLyric = (currentLyric, currentTime) => {
  const currentLyricVal = currentLyric.value
  if (currentLyricVal) {
    currentLyricVal.seek(currentTime.value * 1000)
  }
}
export const stopLyric = (currentLyric) => {
  const currentLyricVal = currentLyric.value
  if (currentLyricVal) {
    currentLyricVal.stop()
  }
}
export default useLyric
