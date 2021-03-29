const _baseUrl = 'http://localhost:3000'
const _baseUrl2 = 'http://localhost:3030'

export default {
  /**
   * 获取首页Banner图片数据
   */
  getBannerList () {
    return `${_baseUrl}/banner`
  },
  /**
   * 获取推荐歌单
   */
  getPersonalized () {
    return `${_baseUrl}/personalized`
  },
  /**
   * 获取推荐 mv
   */
  getPersonalizedMV () {
    return `${_baseUrl}/personalized/mv`
  },
  /**
   * 测试
   */
  getHotcommit () {
    return `${_baseUrl}/topic/detail/event/hot?actid=111551188`
  },
  /**
   *
   * @param {*} cat
   * @param {*} order
   * @param {*} offset
   * @param {*} total
   * @param {*} limit
   */
  getPlayListByWhere (offset, limit) {
    return `${_baseUrl}/top/playlist?limit=${limit}&order=all&offset=${offset}`
  },
  /**
   * 获取歌词API
   * @param {Number} id
   */
  getLrc (id) {
    return `${_baseUrl}/lyric?id=${id}`
  },
  /**
   * 获取歌曲 播放URL
   * @param {Number} id
   */
  getSong (id) {
    return `${_baseUrl}/song/url?id=${id}`
  },
  /**
   * 获取歌单详情
   * @param {Number} id
   */
  getPlayListDetail (id) {
    return `${_baseUrl}/playlist/detail?id=${id}`
  },
  getMv (id) {
    return _baseUrl + '?type=mv&id=' + id
  },
  /**
   * 搜索
   * @param {String} words
   */
  search (words) {
    return `${_baseUrl}/search?keywords=${words}`
  },
  // 获取专辑详情
  getalbumPic (id) {
    return `${_baseUrl}/album?id=${id}`
  },
  // model 2
  // 注册接口
  register () {
    return _baseUrl2 + '/register'
  },
  // 登录接口
  login () {
    return _baseUrl2 + '/login'
  }
}
