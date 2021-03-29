import axios from 'axios'
axios.defaults.timeout = 8000
// 添加请求头
axios.defaults.withCredentials = true
// code状态码200判断
axios.interceptors.response.use((res) => {
  if (res.status === 654) { // 百度云请求超时检测
    window.alert('请求超时！')
  }
  return res.data
}, (error) => {
  console.log('promise error:' + error)
  return Promise.reject(error)
})
export default axios
