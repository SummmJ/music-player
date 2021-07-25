<template>
    <div>
        <div id="main" :style="{width: '100%', height: '300px'}" class="main_container"></div>
        <div class="banner">
          <div v-if="isSinger">
            最喜欢的歌手是
            <span>{{this.singer}}</span>，一共听了他的歌 <span>{{this.times}}</span>
            次
          </div>
          <div v-if="isSong">
            最喜欢的歌曲是
            <span>{{this.songs}}</span>
          </div>
        </div>
    </div>
</template>
<script>
import api from '../api'
import * as echarts from 'echarts'
//   import { TitleComponent, GridComponent } from 'echarts/components'
//   import { BarChart } from 'echarts/charts'
//   import { CanvasRenderer } from 'echarts/renderers'
//   echarts.use([TitleComponent, GridComponent, BarChart, CanvasRenderer])

export default {
  data () {
    return {
      option: {},
      isSinger: false,
      isSong: false,
      songs: '',
      singer: '',
      times: 0
    }
  },
  created () {
    let userID = window.sessionStorage.getItem('token')
    if (userID) {
    //   this.analysis(userID)
      this.initCharts(userID)
    }
  },
  methods: {
    // analysis (userID) {
    // },
    initCharts (userID) {
      let formData = []
      this.$http.post(api.analysis(), {userID: userID - 0}).then((data) => {
        console.log(data)
        for (let i = 0; i < data.res1.length; i++) {
          formData[i] = {}
          formData[i].value = data.res1[i].times
          formData[i].name = data.res1[i].name
        }
        this.option = {
          series: [
            {
              name: '歌单统计',
              type: 'pie',
              radius: '55%',
              data: []
            }
          ]
        }
        this.option.series[0].data = formData
        let arr = Object.keys(data.res2)
        if (arr.length !== 0) {
          this.isSinger = true
          this.singer = data.res2.singer
          this.times = data.res2.times
        }
        if (data.res3.length !== 0) {
          this.isSong = true
          let args = []
          for (let i = 0; i < data.res3.length; i++) {
            args.push(data.res3[i].songID)
          }
          this.$http.get(api.getSongDetail(args)).then((res) => {
            for (let i = 0; i < res.songs.length; i++) {
              this.songs += res.songs[i].name + ','
            }
            this.songs = this.songs.substr(0, this.songs.length - 1)
          })
        }
        let myChart = echarts.init(document.getElementById('main'))
        myChart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.banner{
  line-height: 40px;
  font-size: 16px;
  font-family:fantasy!important;
  // color: red;
  width: 100%;
  // height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 17px;
    font-style: italic;
    font-weight: 200;
    color: rgb(141, 141, 141);
  }
}
</style>