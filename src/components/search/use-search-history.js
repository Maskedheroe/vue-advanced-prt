import { useStore } from 'vuex'
import { save, remove, clear } from '../../assets/js/array-store'
import { SEARCH_KEY } from '../../assets/js/constant'
const useSearchHistory = () => {
  const store = useStore()
  const maxLen = 100

  const saveSearch = (query) => {
    const searchs = save(query, SEARCH_KEY, item => item === query, maxLen)
    store.commit('setSearchHistory', searchs)
  }
  const deleteSearch = (query) => {
    const searchs = remove(SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searchs)
  }
  const clearSearch = () => {
    clear(SEARCH_KEY)
    store.commit('setSearchHistory', [])
  }
  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
export default useSearchHistory
