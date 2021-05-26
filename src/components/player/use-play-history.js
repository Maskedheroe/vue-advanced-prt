import { useStore } from 'vuex'
import { PLAY_KEY } from '../../assets/js/constant'
import { save } from '../../assets/js/array-store'

const usePlayHistory = () => {
  const maxLen = 100
  const store = useStore()
  function savePlay(song) {
    const songs = save(song, PLAY_KEY, item => item.id === song.id, maxLen)
    store.commit('setplayHistory', songs)
  }
  return {
    savePlay
  }
}
export default usePlayHistory
