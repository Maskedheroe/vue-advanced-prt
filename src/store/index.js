import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debuge = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  actions,
  getters,
  plugins: debuge ? [createLogger()] : [],
  strict: debuge
  // 插件，开发环境下查看数据流
})
