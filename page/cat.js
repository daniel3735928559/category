var app = angular.module('app',[]);

app.controller("CatCommander", ['$scope','$http', '$window', '$timeout', '$location', '$anchorScroll', function($scope, $http, $window, $timeout, $location, $anchorScroll){
    $scope.nodes = {};
    $scope.active_nodes = {};    
    $scope.search_nodes = {};
    $scope.query = "";

    $scope.raise_error = function(err){
	alert(err);
    }
    
    $scope.search = function(){
	$http.post("/search", JSON.stringify({"query":$scope.query}))
	    .success(
		function(data, status, headers, config) {
		    console.log(data);
		    $scope.search_nodes = data;
		})
	    .error(
		function(data, status, headers, config) {
		    $scope.raise_error("Error: " + data);
		}
	    );
    }

    $scope.get_node = function(node_id){
	var s = JSON.stringify({"id":node_id});
	console.log(s);
	$http.post("/get_node", s)
	    .success(
		function(data, status, headers, config) {
		    console.log("post edges",data.edges);
		    console.log(data);
		    $scope.active_nodes[node_id] = data;
		})
	    .error(
		function(data, status, headers, config) {
		    $scope.raise_error("Error: " + data);
		}
	    );
    }

}]);

