import { PLAY_MODE, SEARCH_KEY } from '../assets/js/constant'
import { load } from '../assets/js/array-store'
const state = { // 播放器的状态
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: [],
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}
export default state
