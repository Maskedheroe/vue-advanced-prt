<template>
  <Header/>
  <Tab/>
  <router-view></router-view>
  <Player/>
</template>

<script>
import Header from '@/components/header/Header'
import Tab from './components/tab/Tab'
import Player from './components/player/Player'
export default {
  components: {
    Header,
    Tab,
    Player
  }
}

</script>

<style lang="scss">

</style>
