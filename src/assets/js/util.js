export function shuffle (source) {
  // 注意，slice一下，就不会修改原数组(source)了
  const arr = source.slice() // slice 对象切成了一个数组
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt (max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap (arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

export function formatTime (interval) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
