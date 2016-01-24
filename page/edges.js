app = app || angular.module('app', []);

app.controller("EdgeDisplayController", ['$scope', function($scope){    //setTimeout($scope.initialize, 0);
    $scope.get_node = $scope.$parent.get_node;

    $scope.toggle_dir = function(edge){
	console.log(edge.dir)
	edge.dir = edge.dir == "is" ? "has" : "is";
    }
    
    $scope.del_edge = function(idx){
	$scope.edges.splice(idx,idx+1);
    }
    
    $scope.add_edge = function(edge){
	$scope.edges.push({"source":$scope.node.name,"dir":"has","name":"","target":""})
    }
}])
    .directive('edges', function(){
	return {
	    restrict: 'E',
	    scope:{
		edges: '=data',
		node: '=node',
		editing: '=editing'
	    },
	    templateUrl:"/page/edge_display_template.html",
	    // templateUrl: function(element,attrs){
	    // 	return attrs.template;
	    // },
	    controller: 'EdgeDisplayController',
	}
    });

