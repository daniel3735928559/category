<template>
    <div id="working_set">
	<h4>
	    Working set <span v-on:click="clear_history()" class="badge_button">clear</span>
	</h4>
	<!-- <div v-for="node in recent">
	     <span v-on:click="remove_from_history(node)" style="cursor:pointer;margin-right:5px;">[x]</span> <router-link :to="{name:'node', params: {id: node}}">{{nodes && nodes[node] ? nodes[node].name : "loading..."}}</router-link> -->
	<!-- <draggable v-model="recent" element="span">
	     <li v-for="node in recent">
	     <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
	     <router-link :to="{name:'doc', params: {id: node}}">{{nodes[node].name}}</router-link>
	     
	     </li>
	     </draggable> -->
	
	<draggable element="span" v-model="recent" v-bind="dragOptions" :move="onMove">
            <transition-group name="no" class="list-group" tag="ul">
		<li class="list-group-item" v-for="node in recent" :key="node.id">
		    <i :class="node.fixed ? 'fa fa-lock' : 'fa fa-pin'" @click="node.fixed = !node.fixed" aria-hidden="true"></i>
		    <router-link :to="{name:'node', params: {id: node.id}}">{{nodes[node.id].name}}</router-link> <span class="node_snippet">{{nodes[node.id].snippet}}</span>
		    <span v-on:click="remove_from_history(node.id)" class="badge_button">x</span>
		</li>
            </transition-group>
	</draggable>
	<!-- </div> -->
    </div>
</template>

<script>
 import { mapState } from 'vuex'
 import draggable from "vuedraggable";
 
 export default {
     name: 'history-display',
     components: {
	 draggable
     },
     data() {
	 return {
	     editable: true,
	     isDragging: false,
	     delayedDragging: false
	 };
     },
     computed: {
	 dragOptions() {
	     return {
		 animation: 0,
		 group: "description",
		 disabled: !this.editable,
		 ghostClass: "ghost"
	     };
	 },
	 ...mapState([
	 'recent', 'nodes'
	 ])
     },
     methods: {
	 onMove({ relatedContext, draggedContext }) {
	     const relatedElement = relatedContext.element;
	     const draggedElement = draggedContext.element;
	     return (
		 (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
	     );
	 },
	 remove_from_history: function(node_id) {
	     this.$store.dispatch('remove_from_history',node_id);
	 },
	 clear_history: function() {
	     this.$store.dispatch('clear_history');
	 }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 #working_set{
     padding-top:5px;
     padding-left:5px;
 }
 .flip-list-move {
     transition: transform 0.5s;
 }
 .no-move {
     transition: transform 0s;
 }
 .node_snippet {
     color:#ccc;
 }
 .ghost {
     opacity: 0.5;
     background: #c8ebfb;
 }
 .list-group {
     min-height: 20px;
 }
 .list-group-item {
     cursor: move;
 }
 .list-group-item i {
     cursor: pointer;
 }
 .badge_button {
     cursor:pointer;
     margin-right:5px;
     display: inline-block;
     min-width: 10px;
     padding: 3px 7px;
     font-size: 12px;
     font-weight: bold;
     line-height: 1;
     color: #fff;
     text-align: center;
     white-space: nowrap;
     vertical-align: middle;
     background-color: #777;
     border-radius: 10px;
     float:right;
 }
</style>
