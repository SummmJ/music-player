<template>
    <div>
        <div class="header">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                class="search"
                v-model="words"
               >
            </el-input>
        </div>
        <!-- 搜索列表区 -->
        <div>
          <div class="search_list" v-for="(item, index) in searchList" :key="index">
            <div class="search_item" @click="playAudioS(item)">
              <div class="left_se"> 
                {{item.name}}   
              </div>
              <div class="singer_se">
                {{item.artists[0].name}}
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import api from '../api'
export default {
  data () {
    return {
      search: '',
      searchList: [],
      words: ''
    }
  },
  watch: {
    words: function () {
      this.throttleSearch()
    }
  },
  created: function () {
    this.throttleSearch = this.throttle(this.loadsearch, 1000)
  },
  methods: {
    loadsearch () {
      console.log(1)
      let words = this.words
      if (words) {
        this.$http.get(api.search(words)).then(data => {
          this.searchList = data.result.songs
        })
      }
    },
    // 节流函数
    throttle (fn, delay) {
      let flag = true
      return (...args) => {
        if (!flag) return
        flag = false
        setTimeout(() => {
          fn.apply(this, args)
          flag = true
        }, delay)
      }
    },
    playAudioS (song) {
      document.getElementById('audioPlay').pause()
      this.$store.commit('pause')
      var audio = {}
      this.$http.get(api.getalbumPic(song.album.id)).then(data => {
        audio.albumPic = data.album.blurPicUrl
      })
      audio.id = song.id  // id
      audio.singerID = song.artists[0].id
      audio.singer = song.artists[0].name // 演唱者
      audio.name = song.name
      // 通过Vuex改变状态
      this.$store.commit('addToList', audio)
      this.$store.dispatch('getSong', audio.id)
      if (this.$store.state.record) {
        this.$store.commit('makeRecord')
        this.$store.dispatch('recordSongs')
      }
    }
  }
}
</script>

<style lang="less">
@import "../assets/theme.less";
html,body { height:100%; overflow:hidden }
.header{
    width: 100%;
    height: 56px;
    // background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
}
// .header .search{ 
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
.header .el-input{
    width: 350px;
}
.search .el-input__inner{
    border: none;
    border-radius: 20px;
    background-color: #f4f4f4;
}
.search_list{
  height: 100%;
  overflow: scroll;
}
.search_item{
  padding-left: 20px;
  width: 100%;
  height: 50px;
}
.left_se{
  width: 100%;
  font-size: 16px;
  overflow: hidden;    
  text-overflow:ellipsis;    
  white-space: nowrap;
}
.singer_se{
  color: #8a8a8a;
  position: relative;
  right: 0;
}
</style>
