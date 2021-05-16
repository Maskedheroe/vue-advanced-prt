import { PLAY_MODE } from '../assets/js/constant'
const state = { // 播放器的状态
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false
}
export default state
