import { createApp } from 'vue'
import Loading from './Loading.vue'
import { removeClass, addClass } from '../../../assets/js/dom'

const relativeCls = 'g-relative'

const loadingDirective = {
  mounted (el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    const title = binding.arg
    // if (typeof title !== 'undefined') {
    //   instance.setTitle(title)
    // }
    // 不用这种判空
    // 用短路判空
    title && instance.setTitle(title)
    if (binding.value) {
      append(el)
    }
  },
  updated (el, binding) {
    const title = binding.arg
    title && el.instance.setTitle(title)
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

const append = el => {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

const remove = el => {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
