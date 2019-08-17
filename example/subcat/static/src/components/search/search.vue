<template>
  <div class="searchbar">
    Search: 
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'search',
  computed: mapState([
    'nodes'
  ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
