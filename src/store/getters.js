export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
  // return state.playList[state.currentIndex] || {} 这种保护方法也可以使用
}
