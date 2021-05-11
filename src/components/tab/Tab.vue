<template>
  <div class="tab">
    <router-link
      class="tab__item"
      v-for="(tab, index) in tabs"
      :key="index"
      :to="tab.path"
    >
      <span class="tab__link">{{tab.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  setup () {
    const tabs = [
      {
        name: '推荐',
        path: '/recommend'
      },
      {
        name: '歌手',
        path: '/singer'
      },
      {
        name: '排行',
        path: '/toplist'
      },
      {
        name: '搜索',
        path: '/search'
      }
    ]
    return {
      tabs
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;

    &__item {
      flex: 1;
      text-align: center;

      &__link {
        padding-bottom: 5px;
        color: $color-text-l;
      }

      &.router-link-active {
        .tab__link {
          color: $color-theme;
          border-bottom: 2px solid $color-theme;
        }
      }
    }
  }
</style>
