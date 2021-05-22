import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '../../assets/js/array-store'
import { FAVORITE_KEY } from '../../assets/js/constant'

const useFavorite = () => {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100
  const getFavoriteIcon = (song) => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  const isFavorite = (song) => {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }
  const toggleFavorite = (song) => {
    let list = []
    const compare = (item) => {
      return item.id === song.id
    }
    if (isFavorite(song)) {
      // remove
      list = remove(FAVORITE_KEY, compare)
    } else {
      // save
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
  }
  return {
    getFavoriteIcon,
    toggleFavorite
  }
}

export default useFavorite
