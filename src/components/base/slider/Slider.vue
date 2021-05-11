<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}">
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const useSlider = (wrapperRef) => {
  // 1.这个方法可以抽到一个文件中去，称之为逻辑抽离
  // 并且适合抽离，因为该组件引用了第三方库，不应该与本业务的视图耦合
  // 2.为什么参数不能直接传一个wrapperRef.value进来？
  // 因为这样传，DOM节点失响，会为undefined
  // 而响应式的数据，会在数据变化是同步，等到DOM渲染完同步一次，就不会为undefined
  const slider = ref(null)
  const currentPageIndex = ref(0)
  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    sliderVal.on('slideWillChange', page => {
      currentPageIndex.value = page.pageX
    })
  })
  onUnmounted(() => {
    slider.value.destroy()
  })
  return {
    slider,
    currentPageIndex
  }
}

export default {
  name: 'slider',
  props: {
    sliders: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup () {
    const rootRef = ref(null)
    const { slider, currentPageIndex } = useSlider(rootRef)
    return {
      rootRef,
      slider,
      currentPageIndex
    }
  }
}
</script>

<style lang="scss" scoped>
  .slider {
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
