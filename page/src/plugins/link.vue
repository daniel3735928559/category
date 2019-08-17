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
	 var doc = this.root.innerHTML.trim();
	 var idx = doc.indexOf(":");
	 this.target = doc.substring(0,idx);
	 this.name = doc.substring(idx+1);
     }
 }
</script>
