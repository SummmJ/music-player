<template>
  <div>
    <div class="button" @click="recommend" v-if="!ifList">
      <el-button round>生成每日推荐歌曲</el-button>
    </div>
    <div>
      <mu-circular-progress :size="40" class="center" v-if="isloading"/>
        <mu-list :value="value" v-show="!isloading" @change="change">
          <div v-for="(item, index) in list" :key="item.id" @click="playAudio(item)">
            <mu-list-item  :disableRipple="true" :title="item.name" :value="item.id" :describeText="item.ar[0].name">
              <span slot="left" class="indexStyle">{{index + 1}}</span>
                </mu-list-item>
                <mu-divider inset></mu-divider>
          </div>
        </mu-list>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      ifList: false,
      list: [],
      value: 0,
      isloading: false
    }
  },
  created () {
    if (!window.sessionStorage.getItem('token')) {
      this.ifList = false
    }
  },
  methods: {
    change (val) {
      this.value = val
    },
    playAudio (song) {
      document.getElementById('audioPlay').pause()
      this.$store.commit('pause')
      var audio = {}
      audio.id = song.id  // id
      audio.singerID = song.ar[0].id // 演唱者id
      audio.singer = song.ar[0].name // 演唱者
      audio.albumPic = song.al.picUrl
      audio.name = song.name
      // 通过Vuex改变状态
      this.$store.commit('addToList', audio)
      this.$store.dispatch('getSong', audio.id)
      console.log(this.$store.state.record.length)
      if (this.$store.state.record) {
        this.$store.commit('makeRecord')
        this.$store.dispatch('recordSongs')
      }
    },
    recommend () {
      this.isloading = true
      let userID = window.sessionStorage.getItem('token')
      this.$http.post(api.recommend(), {userID: userID - 0}).then((data) => {
        console.log(data)
        this.$http.get(api.getSongDetail(data.simSongID)).then((res) => {
          console.log(res.songs)
          for (let i = 0; i < res.songs.length; i++) {
            this.list[i] = res.songs[i]
          }
          this.list = this.list.slice(0, 7)
        })
        this.$http.get(api.getArtists(data.simSingerID[0])).then((res) => {
          for (let i = 0; i < 4; i++) {
            this.list.push(res.hotSongs[i])
          }
        })
        this.list = this.list.slice(0, 11)
        this.isloading = false
        this.ifList = true
        console.log(this.list)
      })
    }
  },
  computed: {
    ...mapGetters([
      'songList'
    ])
  }
}
</script>
<style lang="less" scoped>
.button {
height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
      display: block!important;
      margin: 10% auto 0;
}
.indexStyle {
    padding-left: 10px;
    font-size: 18px;
    font-weight: bolder;
    }
</style>