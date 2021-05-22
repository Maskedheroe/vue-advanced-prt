<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal" 
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <template v-if="currentSong">
          <div class="background">
            <img :src="currentSong.pic" />
          </div>
          <div class="top">
            <div class="back" @click="goBack">
              <i class="icon-back"></i>
            </div>
            <h1 class="title">{{ currentSong.name }}</h1>
            <h2 class="subtitle">{{ currentSong.singer }}</h2>
          </div>
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend.prevent="onMiddleTouchEnd"
          >
            <div class="middle-l" :style="middleLStyle">
              <div class="cd-wrapper" ref="cdWrapperRef">
                <div class="cd" ref="cdRef">
                  <img
                    :src="currentSong.pic"
                    class="image"
                    :class="cdCls"
                    ref="cdImageRef"
                  />
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{ playingLyric }}</div>
              </div>
            </div>
            <Scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyricListRef">
                  <p
                    class="text"
                    :class="{ current: currentLineNum === index }"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.num"
                  >
                    {{ line.txt }}
                  </p>
                </div>
                <div class="pure-music" v-show="pureMusicLyric">
                  <p>{{ pureMusicLyric }}</p>
                </div>
              </div>
            </Scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span
                class="dot"
                :class="{ active: currentShow === 'cd' }"
              ></span>
              <span
                class="dot"
                :class="{ active: currentShow === 'lyric' }"
              ></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{ formatTime(currentTime) }}</span>
              <div class="progress-bar-wrapper">
                <ProgressBar
                  ref="barRef"
                  :progress="progress"
                  @progress-changing="onProgressChanging"
                  @progress-changed="onProgressChanged"
                />
              </div>
              <span class="time time-r">{{
                formatTime(currentSong.duration)
              }}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i :class="modeIcon" @click="changeMode"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i class="icon-prev" @click="prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i :class="playIcon" @click="togglePlay"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i class="icon-next" @click="next"></i>
              </div>
              <div class="icon i-right">
                <i
                  @click="() => toggleFavorite(currentSong)"
                  :class="getFavoriteIcon(currentSong)"
                >
                </i>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :togglePlay="togglePlay" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './ProgressBar'
import { formatTime } from '../../assets/js/util'
import { PLAY_MODE } from '../../assets/js/constant'
import useCd from './use-cd'
import useLyric, { stopLyric, playLyric } from './use-lyric'
import Scroll from '../base/scroll/Scroll'
import useMiddleInteractive from './use-middle-interactive'
import MiniPlayer from './MiniPlayer'
import useAnimation from './use-animation'
const useFullScreenEffect = (store, barRef, progress) => {
  const fullScreen = computed(() => store.state.fullScreen)
  watch(fullScreen, async (newFullScreen) => {
    if (newFullScreen) {
      await nextTick()
      barRef.value.setOffset(progress.value)
    }
  })
  return {
    fullScreen
  }
}

const useCurrentSongEffect = (store, songReady, audioRef) => {
  const currentSong = computed(() => store.getters.currentSong)
  watch(currentSong, (newSong) => {
    if (!newSong.id || !newSong.url) {
      return
    }
    songReady.value = false
    const audioEl = audioRef.value
    audioEl.src = newSong.url
    audioEl.play()
    store.commit('setPlayState', true)
  })
  return {
    currentSong
  }
}

const useHandleBackEffect = (store) => {
  const goBack = () => {
    store.commit('setFullScreen', false)
  }
  return {
    goBack
  }
}

const useDisableClsEffect = (songReady) => {
  const disableCls = computed(() => {
    return songReady.value ? '' : 'disable'
  })
  return {
    disableCls
  }
}

// 播放相关逻辑，包括前进后退暂停等
const usePlayingEffect = (
  store,
  songReady,
  audioRef,
  currentTime,
  progressChanging
) => {
  const playing = computed(() => store.state.playing)
  const currentIndex = computed(() => store.state.currentIndex)
  const playList = computed(() => store.state.playList)
  const playMode = computed(() => store.state.playMode)

  const togglePlay = () => {
    if (!songReady.value) {
      return
    }
    store.commit('setPlayState', !playing.value)
  }

  const pause = () => {
    // 其他方式暂停时，使用audio给的pause方法来监听这种情况
    store.commit('setPlayState', false)
  }
  const prev = () => {
    const list = playList.value
    if (!songReady.value || !list.length) {
      return
    }
    if (list.length === 1) {
      loop()
    } else {
      let index = currentIndex.value - 1
      if (index === -1) {
        index = list.length - 1
      }
      store.commit('setCurrentIndex', index)
    }
  }
  const next = () => {
    const list = playList.value
    if (!songReady.value || !list.length) {
      return
    }
    if (list.length === 1) {
      loop()
    } else {
      let index = currentIndex.value + 1
      if (index === list.length) {
        index = 0
      }
      store.commit('setCurrentIndex', index)
    }
  }
  const loop = () => {
    const audioEl = audioRef.value
    audioEl.currentTime = 0
    audioEl.play()
    store.commit('setPlayState', true)
  }
  const playIcon = computed(() => {
    return playing.value ? 'icon-pause' : 'icon-play'
  })
  const updateTime = (e) => {
    if (!progressChanging) {
      currentTime.value = e.target.currentTime
    }
  }
  const end = () => {
    currentTime.value = 0
    if (playMode.value === PLAY_MODE.loop) {
      loop()
    } else {
      next()
    }
  }
  return {
    togglePlay,
    pause,
    prev,
    next,
    playIcon,
    updateTime,
    playing,
    end,
    playList
  }
}
const useReadySituationEffect = (songReady, currentLyric, currentTime) => {
  const ready = () => {
    if (songReady.value) {
      return
    }
    songReady.value = true
    playLyric(currentLyric, currentTime)
  }

  const error = () => {
    songReady.value = true
  }
  return {
    ready,
    error
  }
}
const useTimeEffect = (
  store,
  currentSong,
  audioRef,
  progressChanging,
  currentLyric
) => {
  const currentTime = ref(0)
  const playing = computed(() => store.state.playing)
  const progress = computed(() => {
    return currentTime.value / currentSong.value.duration
  })
  const onProgressChanging = (pgs) => {
    progressChanging = true
    currentTime.value = currentSong.value.duration * pgs
    playLyric(currentLyric, currentTime) // 先同步再停止
    stopLyric(currentLyric)
  }
  const onProgressChanged = (pgs) => {
    progressChanging = false
    audioRef.value.currentTime = currentTime.value =
      currentSong.value.duration * pgs
    if (!playing.value) {
      store.commit('setPlayState', true)
    }
    playLyric(currentLyric, currentTime) // 改变完再同步一次，这是解决拖动完不继续播放的bug
  }
  return {
    currentTime,
    progress,
    onProgressChanging,
    onProgressChanged
  }
}
const useWatchPlayingEffect = (
  playing,
  songReady,
  audioRef,
  currentLyric,
  currentTime
) => {
  watch(playing, (newPlaying) => {
    // 加载未完成则直接返回
    if (!songReady.value) {
      return
    }
    const audioEl = audioRef.value
    if (newPlaying) {
      audioEl.play()
      playLyric(currentLyric, currentTime)
    } else {
      audioEl.pause()
      stopLyric(currentLyric)
    }
  })
}

export default {
  name: 'player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
    const store = useStore()
    const songReady = ref(false)
    const audioRef = ref(null)
    const currentLyric = ref(null)
    const barRef = ref(null)
    const progressChanging = false // 设置优先级高一点

    const { currentSong } = useCurrentSongEffect(store, songReady, audioRef)
    const { goBack } = useHandleBackEffect(store)
    const { disableCls } = useDisableClsEffect(songReady)
    const {
      currentTime,
      progress,
      onProgressChanging,
      onProgressChanged
    } = useTimeEffect(
      store,
      currentSong,
      audioRef,
      progressChanging,
      currentLyric
    )
    const { fullScreen } = useFullScreenEffect(store, barRef, progress)
    const {
      togglePlay,
      pause,
      prev,
      next,
      playIcon,
      updateTime,
      end,
      playing,
      playList
    } = usePlayingEffect(
      store,
      songReady,
      audioRef,
      currentTime,
      progressChanging
    )
    const {
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric
    } = useLyric({ songReady, currentLyric, currentTime })
    const { ready, error } = useReadySituationEffect(
      songReady,
      currentLyric,
      currentTime
    )
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const {
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    } = useAnimation()
    useWatchPlayingEffect(
      playing,
      songReady,
      audioRef,
      currentLyric,
      currentTime
    )
    const {
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle
    } = useMiddleInteractive()
    return {
      barRef,
      audioRef,
      fullScreen,
      currentSong,
      goBack,
      disableCls,
      // 播放一系列业务
      togglePlay,
      pause,
      prev,
      next,
      playIcon,
      updateTime,
      end,
      playList,
      // 准备状态系列业务
      ready,
      error,
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // time
      currentTime,
      progress,
      onProgressChanging,
      onProgressChanged,
      // util
      formatTime,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      cdWrapperRef,
      // lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // middle
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle,
      // animation
      enter,
      afterEnter,
      leave,
      afterLeave
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
