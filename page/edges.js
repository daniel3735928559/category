app = app || angular.module('app', []);

app.controller("EdgeDisplayController", ['$scope', function($scope){    //setTimeout($scope.initialize, 0);
}])
    .directive('edges', function(){
	return {
	    restrict: 'E',
	    scope:{
		data: '@data',
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

