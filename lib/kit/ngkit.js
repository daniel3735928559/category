app = app || angular.module('app', []);

app.controller("KitController", ['$scope', function($scope){
    $scope.test = "hello";
    $scope.initialize = function(){
	$scope.kit = new Kit(
	    {'input':$scope.input,
	     'container':$scope.container,
	     'edit':function(){
		 $scope.output.style.display = "none";
		 $scope.input.style.display = "inline-block";
	     },
	     'output':function(doc){
		 $scope.input.style.display = "none";
		 $scope.output.style.display = "inline-block";
		 $scope.output.innerHTML = "";
		 $scope.output.appendChild(doc);
	     },
	     'data':$scope.data || ""
	    }
	);
    }

    //setTimeout($scope.initialize, 0);
}])
    .directive('kit',function(){
	return {
	    restrict: 'E',
	    scope:{
		data: '@data',
		kitid: '@kitid'
	    },
	    templateUrl:"/lib/kit/kit_template.html",
	    // templateUrl: function(element,attrs){
	    // 	return attrs.template;
	    // },
	    controller: 'KitController',
	    link: function(scope, element, attrs){
		scope.container = element[0].getElementsByClassName('kit_container')[0];
		scope.input = element[0].getElementsByClassName('kit_area')[0];
		scope.output = element[0].getElementsByClassName('kit_output')[0];
		scope.initialize();
	    }
	}
    });

