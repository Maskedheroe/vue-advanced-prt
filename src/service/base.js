import axios from 'axios'

const baseURL = '/'
const ERR_OK = 0
// axios.defaults.baseURL = baseURL
const instance = axios.create({
  baseURL
})

export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, { params }).then(res => {
      const serverData = res.data
      if (serverData.code === ERR_OK) {
        resolve(serverData.result)
      }
    }, err => {
      reject(err)
    })
  })
  // return axios.get(url, {
  //   params
  // }).then((res) => {
  //   const serverData = res.data
  //   if (serverData.code === ERR_OK) {
  //     return serverData.result
  //   }
  // }).catch((e) => {
  //   console.log(e)
  // })
}
