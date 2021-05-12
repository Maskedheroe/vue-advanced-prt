<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import storage from 'good-storage'
import { getSingerList } from '@/service/singer'
import IndexList from '../components/base/index-list/Index-list'
import { SINGER_KEY } from '../assets/js/constant'
export default {
  name: 'Singer',
  components: {
    IndexList
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      // 缓存
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
