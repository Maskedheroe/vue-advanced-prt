<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/MusicList'
export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    pic () {
      return this.singer && this.singer.pic
    },
    title () {
      return this.singer && this.singer.name
    }
  },
  props: {
    singer: Object
  },
  async created () {
    const result = await getSingerDetail(this.singer)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
