<template>
    <router-link :to="'./'+target">{{name}}</router-link>
</template>
<script>
 export default {
     name: 'cat-link',
     props: ['root'],
     data () {
	 return {
	     target: '',
	     name: ''
	 };
     },
     mounted: function(){
	 console.log("LINK",this.root);
	 var doc = this.root.innerHTML.trim();
	 console.log('doc',doc);
	 var idx = doc.indexOf(":");
	 this.target = doc.substring(0,idx);
	 this.name = doc.substring(idx+1);
     }
 }
</script>
