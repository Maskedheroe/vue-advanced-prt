<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <SearchInput v-model="query" placeholder="搜索歌曲"></SearchInput>
        </div>
        <div v-show="!query">
          <Switches
            :items="['最近播放', '搜索历史']"
            v-model="currentIndex"
          ></Switches>
          <div class="list-wrapper">
            <Scroll
              v-if="currentIndex === 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <SongList :songs="playHistory" @select="selectSongBySongList">
                </SongList>
              </div>
            </Scroll>
            <Scroll
              v-if="currentIndex === 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <SearchList
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></SearchList>
              </div>
            </Scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <Suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          >
          </Suggest>
        </div>
        <Message ref="messageRef">
          <!-- message里的slot便存放着如下DOM -->
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '../search/search-input'
import Suggest from '../search/Suggest'
import Scroll from '../base/scroll/Scroll'
import SearchList from '../base/search-list/SearchList'
import Switches from '../base/switches/Switches'
import SongList from '../base/song-list/SongList'
import useSearchHistory from '../../components/search/use-search-history'
import Message from '../base/message/Message'
export default {
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Scroll,
    SearchList,
    Switches,
    SongList,
    Message
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)
    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)
    const { saveSearch } = useSearchHistory()
    watch(query, async () => {
      if (!query.value) {
        await nextTick()
        refreshScroll()
      }
    })
    const show = async () => {
      // 给组件实例使用，外部会拿到该实例
      visible.value = true
      await nextTick()
      refreshScroll()
    }
    const hide = () => {
      visible.value = false
    }
    const addQuery = (s) => {
      query.value = s
    }
    const selectSongBySongList = ({ song }) => {
      addSong(song)
    }
    function addSong(song) {
      store.dispatch('addSong', song)
      showMessage()
    }
    const selectSongBySuggest = (song) => {
      addSong(song)
      saveSearch(query.value)
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }  
    function showMessage() {
      messageRef.value.show()
    }
    return {
      scrollRef,
      messageRef,
      visible,
      query,
      show,
      hide,
      currentIndex,
      searchHistory,
      playHistory,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
