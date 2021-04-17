import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import api from '../api'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName: '未登录',
    audio: {
      'id': 0,
      'name': '歌曲名称',
      'singerID': 0,
      'singer': '演唱者',
      'albumPic': '/static/placeholder_disk_play_program.png',
      'location': '',
      'album': ''
    },
    record: {}, // 听歌记录
    lyric: '',
    currentIndex: 0, // 当前播放的歌曲位置
    playing: false, // 是否正在播放
    loading: false, // 是否正在加载中
    showDetail: false,
    songList: [],    // 播放列表
    currentTime: 0,
    tmpCurrentTime: 0,
    durationTime: 0,
    bufferedTime: 0,
    change: false   // 判断是更改的时间还是播放的时间
  },
  getters: {
    userName: state => state.userName,
    audio: state => state.audio,
    playing: state => state.playing,
    loading: state => state.loading,
    showDetail: state => state.showDetail,
    durationTime: state => state.durationTime,
    currentIndex: state => state.currentIndex,
    bufferedTime: state => state.bufferedTime,
    tmpCurrentTime: state => state.tmpCurrentTime,
    songList: state => state.songList,
    change: state => state.change,
    currentTime: state => state.currentTime,
    record: state => state.record,
    prCurrentTime: state => {
      return state.currentTime / state.durationTime * 100
    },
    prBufferedTime: state => {
      return state.bufferedTime / state.durationTime * 100
    }
  },
  mutations: {
    play (state) {
      state.playing = true
    },
    pause (state) {
      state.playing = false
    },
    toggleDetail (state) {
      state.showDetail = !state.showDetail
    },
    setAudio (state) {
      state.audio = state.songList[state.currentIndex - 1]
    },
    setAudioIndex (state, index) {
      state.audio = state.songList[index]
      state.currentIndex = index + 1
    },
    removeAudio (state, index) {
      state.songList.splice(index, 1)
      if (index === state.songList.length) {
        index--
      }
      state.audio = state.songList[index]
      state.currentIndex = index + 1
      if (state.songList.length === 0) {
        state.audio = {
          'id': 0,
          'name': '歌曲名称',
          'singer': '演唱者',
          'albumPic': '/static/player-bar.png',
          'location': '',
          'album': ''
        }
        state.playing = false
      }
    },
    chageName (state, name) {
      state.userName = name
    },
    setChange (state, flag) {
      state.change = flag
    },
    setLocation (state, location) {
      state.audio.location = location
    },
    updateCurrentTime (state, time) {
      state.currentTime = time
    },
    updateDurationTime (state, time) {
      state.durationTime = time
    },
    updateBufferedTime (state, time) {
      state.bufferedTime = time
    },
    changeTime (state, time) {
      state.tmpCurrentTime = time
    },
    openLoading (state) {
      state.loading = true
    },
    closeLoading (state) {
      state.loading = false
    },
    resetAudio (state) {
      state.currentTime = 0
    },
    playNext (state) { // 播放下一曲
      state.currentIndex++
      if (state.currentIndex > state.songList.length) {
        state.currentIndex = 1
      }
      state.audio = state.songList[state.currentIndex - 1]
    },
    playPrev (state) { // 播放上一曲
      state.currentIndex--
      if (state.currentIndex < 1) {
        state.currentIndex = state.songList.length
      }
      state.audio = state.songList[state.currentIndex - 1]
    },
    addToList (state, songs) {
      var items = Array.prototype.concat.call(songs)
      items.forEach(item => {
        var flag = false
        state.songList.forEach(function (element, index) { // 检测歌曲重复
          if (element.id === item.id) {
            flag = true
            state.currentIndex = index + 1
          }
        })
        if (!flag) {
          state.songList.push(item)
          state.currentIndex = state.songList.length
        }
      })
    },
    setLrc (state, lrc) {
      state.lyric = lrc
    },
    makeRecord (state) {
      let userID = window.sessionStorage.getItem('token')
      if (userID) {
        let rating = (state.currentTime / state.durationTime) * 100 / 100
        rating = rating.toFixed(2)
        console.log(state.currentTime, state.durationTime)
        // 用户歌曲的喜爱值 -1为不喜欢  喜欢为1，2，3依次递增
        let loveValue = 0
        if (rating <= 0.4 && rating > 0.1) {
          loveValue = 1
        } else if (rating <= 0.1) {
          loveValue = -1
        } else if (rating > 0.4 && rating < 0.8) {
          loveValue = 2
        } else if (rating >= 0.8) {
          loveValue = 3
        }
        let record = {
          userID: userID,
          songID: state.audio.id,
          loveValue: loveValue,
          singerID: state.audio.singerID,
          singer: state.audio.singer
        }
        state.record = record
        // this.$http.post(api.makeRecords(), record).then(data => {
        //   console.log(data)
        // })
        // console.log(record)
      } else {
        return 1
      }
    }
  },
  // 异步的数据操作
  actions: {
    getSong ({commit, state}, id) {
      // debugger
      // 使用 CancelToken 退出一个Axios事件
      var CancelToken = Axios.CancelToken
      var source = CancelToken.source()
      if (state.loading && state.songList.length > 0) {
        console.log('cancel')
        source.cancel()
      }
      commit('openLoading')
      Axios.get(api.getSong(id)).then(data => {
        // 统一数据模型，方便后台接口的改变
        var url = data.data[0].url
        commit('setAudio')
        commit('setLocation', url)
      })
      .catch((error) => {     // 错误处理
        console.log(error)
        window.alert('获取歌曲信息出错！')
      })
    },
    recordSongs (state) {
      // debugger
      let userID = window.sessionStorage.getItem('token')
      console.log(state.state.record)
      if (userID) {
        Axios.post(api.makeRecords(), state.state.record).then((data) => {
          console.log(data)
        })
      } else {
        return 1
      }
      // console.log(state.durationTime, state.currentTime, rating, loveValue, state.audio.id, state.audio.singerID)
    }
  }
})
export default store
