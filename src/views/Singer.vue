<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList  :data="singers" @select="selectSinger"/>
    <router-view :singer="selectedSinger"/>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '../components/base/index-list/Index-list'
export default {
  name: 'Singer',
  components: {
    IndexList
  },
  async created () {
    const result = await getSingerList()
    this.singers = result.singers
  },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
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
