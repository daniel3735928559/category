<template>
    <div id="cafeapp" class="container-full-width">
	<div id="main" class="row">
	    <div class="col-md-7 offset-md-1">
		<div id="main_col">
		    <router-view></router-view>
		</div>
	    </div>
	    
	    <div class="col-md-3">
		<node-filter />
		<history-display />
	    </div>
	    
	</div>
    </div>
</template>

<style>
 #cafeapp {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     color: #2c3e50;
     margin-top: 5px;
 }

 #sidebar{
    padding:5px;
 }
 #main{
     height:100%;
 }

 #graph{
     width: 100%;
     height:100vh;
     border: 1px solid black;
 }

 #query_input{
     width:100%;
 }

 #main_col{
 }

 blockquote {
     border-left: 4px solid #ccc;
     padding-left: 1em;
     color: #777;
 }
 
</style>
