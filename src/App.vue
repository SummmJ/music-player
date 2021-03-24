<template>
  <div>
      <keep-alive>
          <router-view></router-view>
      </keep-alive>
    <Player></Player>
  </div>
</template>
<script>
  import Player from './components/playerBar'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    components: {
      Player
    },
    computed: {
      ...mapGetters([
        'songList',
        'showDetail'
      ])
    }
  }
</script>
