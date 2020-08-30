<template>
    <div><a v-bind:name="'cat_loc_'+loc"></a>
    <ul v-if="links.length > 0">
	<li v-for="l in links"><a href="#" v-on:click="goto(i.secs)">{{l.name}}</a></li>
    </ul></div>
</template>
<script>
 export default {
     name: 'cat-loc',
     props: ['root'],
     data () {
	 return {
	     loc:'',
	     links:[],
	 };
     },
     mounted: function(){
	 // Parse the link info
	 var locs = this.root.innerHTML.split("\n");
	 this.loc = lines[0].trim();
     }
 }
</script>
