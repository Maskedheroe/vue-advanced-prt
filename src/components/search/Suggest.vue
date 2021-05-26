<template>
  <div
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
    ref="rootRef"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="() => selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="() => selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '../../service/search'
import { processSongs } from '../../service/song'
import usePullUpLoad from './use-pull-up-load'

const useSearchDataEffect = (props, makeItScrollable) => {
  const singer = ref(null)
  const songs = ref([])
  const hasMore = ref(true)
  const page = ref(1)

  const searchFirst = async () => {
    page.value = 1
    songs.value = []
    singer.value = null
    hasMore.value = true

    const result = await search(props.query, page.value, props.showSinger)
    songs.value = await processSongs(result.songs)
    singer.value = result.singer
    hasMore.value = result.hasMore
    await nextTick()
    await makeItScrollable()
  }
  const noResult = computed(() => {
    return !singer.value && !songs.value.length && !hasMore.value
  })
  const loading = computed(() => {
    return !singer.value && !songs.value.length
  })
  const searchMore = async () => {
    if (!hasMore.value || !props.query) {
      return
    }
    page.value++
    const result = await search(props.query, page.value, props.showSinger)
    songs.value = songs.value.concat(await processSongs(result.songs))
    hasMore.value = result.hasMore
  }
  return {
    singer,
    songs,
    hasMore,
    page,
    noResult,
    loading,
    searchFirst,
    searchMore
  }
}
const useDefaultTextEffect = () => {
  const loadingText = ref('')
  const noResultText = ref('抱歉，暂无搜索结果')
  return {
    loadingText,
    noResultText
  }
}
export default {
  name: 'Suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const manualLoading = ref(false)
    const {
      singer,
      songs,
      hasMore,
      noResult,
      loading,
      searchFirst,
      searchMore
    } = useSearchDataEffect(props, makeItScrollable)
    const { loadingText, noResultText } = useDefaultTextEffect
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })
    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    )
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }
    const selectSong = (song) => {
      emit('select-song', song)
    }
    const selectSinger = (singer) => {
      emit('select-singer', singer)
    }
    return {
      singer,
      songs,
      loadingText,
      noResult,
      loading,
      noResultText,
      // hasMore
      // page,
      // PullUpLoad部分
      rootRef,
      isPullUpLoad,
      pullUpLoading,
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
