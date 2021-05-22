import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/util'
// actions 就是对多个mutation的封装
export const selectPlay = ({ commit }, { list, index }) => {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export const randomPlay = ({ commit }, list) => {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export const changeMode = ({ commit, state, getters }, mode) => {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex((song) => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export const removeSong = ({ commit, state }, song) => {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) { // 保护操作代码，代码逻辑更加严谨
    return
  }
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)
  let currentIndex = state.currentIndex

  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayState', false)
  }
}
const findIndex = (list, song) => {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const clearSongList = ({ commit }) => {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayState', false)
}
