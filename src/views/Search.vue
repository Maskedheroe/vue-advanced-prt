<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <scroll class="search-content" v-show="!query" ref="scrollRef">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="() => addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-if="searchHistory?.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <Confim
            ref="confimRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
          <SearchList
            :searchs="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          />
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @select-song="selectSong"
        @selectSinger="selectSinger"
      />
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { reactive, ref, toRefs, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { getHotKeys } from '../service/search'
import { SINGER_KEY } from '../assets/js/constant'
import SearchList from '../components/base/search-list/SearchList'
import Suggest from '../components/search/Suggest'
import SearchInput from '../components/search/search-input'
import useSearchHistory from '../components/search/use-search-history'
import scroll from '../components/wrap-scroll'
import Confim from '../components/base/confirm/Confirm'
const useSearchEffect = () => {
  const queryData = reactive({
    query: '',
    hotKeys: []
  })
  getHotKeys().then((res) => {
    queryData.hotKeys = res.hotKeys
  })
  const addQuery = (s) => {
    queryData.query = s
  }
  const refData = toRefs(queryData)
  return {
    ...refData,
    addQuery
  }
}

export default {
  name: 'Search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    scroll,
    Confim
  },
  setup() {
    const store = useStore()
    const route = useRouter()
    const scrollRef = ref(null)
    const confimRef = ref(null)
    const { query, hotKeys, addQuery } = useSearchEffect()
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()
    const selectedSinger = ref(null)
    const searchHistory = computed(() => store.state.searchHistory)
    const selectSong = (song) => {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }
    const selectSinger = (singer) => {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      route.push({ path: `/search/${singer.mid}` })
    }
    function cacheSinger(singer) {
      // 缓存
      storage.session.set(SINGER_KEY, singer)
    }
    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    const showConfirm = () => {
      confimRef.value.show()
    }
    return {
      scrollRef,
      confimRef,
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectedSinger,
      selectSinger,
      searchHistory,
      deleteSearch,
      clearSearch,
      showConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
