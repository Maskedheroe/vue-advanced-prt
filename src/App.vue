<template>
  <Header/>
  <Tab/>
  <router-view></router-view>
</template>

<script>
import Header from '@/components/header/Header'
import Tab from './components/tab/Tab'
export default {
  components: {
    Header,
    Tab
  }
}

</script>

<style lang="scss">

</style>
