app = app || angular.module('app', []);

app.controller("EdgeDisplayController", ['$scope', function($scope){    //setTimeout($scope.initialize, 0);
    $scope.get_node = $scope.$parent.get_node;
}])
    .directive('edges', function(){
	return {
	    restrict: 'E',
	    scope:{
		data: '@data',
		editing: '=editing'
	    },
	    templateUrl:"/page/edge_display_template.html",
	    // templateUrl: function(element,attrs){
	    // 	return attrs.template;
	    // },
	    controller: 'EdgeDisplayController',
	    link: function(scope, element, attrs){
		scope.edges = JSON.parse(scope.data)
		console.log('edges', scope.edges, typeof(scope.edges))
	    }
	}
    });

