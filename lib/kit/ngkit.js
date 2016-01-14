app = app || angular.module('app', []);

app.controller("KitController", ['$scope', function($scope){
    $scope.test = "hello";
    $scope.initialize = function(){
	$scope.kit = new Kit(
	    {'input':$scope.input,
	     'container':$scope.container,
	     'output':$scope.done,
	     'data':$scope.data || "<node />"
	    }
	);
    }
    $scope.done = function(doc, saving){
	if($scope.kit) $scope.data = $scope.kit.get_text();
	console.log("DD",$scope.data, saving);
	$scope.output.innerHTML = "";
	$scope.output.appendChild(doc);
	var e = new Error('dummy');
	var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	    .replace(/^\s+at\s+/gm, '')
	    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
	    .split('\n');
	console.log(stack);
	if(saving)
	    $scope.finish($scope.nodeid, $scope.kit.get_data());
	$scope.$apply();
    }

    //setTimeout($scope.initialize, 0);
}])
    .directive('kit',function(){
	return {
	    restrict: 'E',
	    scope:{
		data: '=data',
		editing: '=editing',
		finish: '=finish',
		change: '=change',
		nodeid: '=nodeid'
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
		scope.$watch('editing',function(oldValue, newValue){
		    if(newValue !== oldValue){
			console.log(scope.editing)
			if(!(scope.editing) && scope.kit){
			    scope.done(scope.kit.render(),true);
			}
		    }
		});
	    }
	}
    });

