<template>
  <Header />
  <Tab />
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view name="user" :style="viewStyle" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <Player />
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/header/Header'
import Tab from './components/tab/Tab'
import Player from './components/player/Player'
export default {
  components: {
    Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState(['playList'])
  }
}
</script>

<style lang="scss">
</style>
