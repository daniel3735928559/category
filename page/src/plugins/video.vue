<template>
    <div><video :id="id" controls>
	<source :src="url" :type="type" />
	If you are seing this text, your browser does not support the video tag.
    </video>
    <ul v-if="index.length > 0">
	<li v-for="i in index"><a href="#" v-on:click="goto(i.secs)">{{Math.floor(i.secs/60)}}:{{(new String(i.secs % 60)).padStart(2, '0')}} {{i.caption}}</a></li>
    </ul></div>
</template>
<script>
 export default {
     name: 'cat-video',
     props: ['root'],
     data () {
	 return {
	     player: null
	 };
     },
     methods: {
	 goto: function(t){
	     this.player.currentTime = t;
	 }
     },
     mounted: function(){
	 console.log("LINK",this.root);
	 // Parse the link info
	 var lines = root.innerHTML.split("\n");
	 var url = lines[0].trim();
	 console.log("U",url);
	 var index = [];
	 for (var i = 1; i < lines.length; i++) {
	     var time = lines[i].split(" ")[0];
	     var caption = lines[i].substring(lines[i].indexOf(" ")+1);
	     var secs = 60*parseInt(time.split(":")[0])+parseInt(time.split(":")[1]);
	     console.log("S",secs,time);
	     index.push({'secs':secs, 'caption':caption});
	 }
	 var ending = 'video/'+url.substring(url.lastIndexOf(".")+1);
	 this.index = index;
	 this.url = url;
	 this.type = ending;
     }
 }
</script>
