var app = angular.module('app',['toastr']);

app.controller("CatCommander", ['$scope','$http', '$window', '$timeout', '$location', '$anchorScroll', 'toastr', function($scope, $http, $window, $timeout, $location, $anchorScroll, toastr){
    $scope.nodes = {};
    $scope.active_nodes = [];    
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
		    data['editing'] = false;
		    data['name'] = node_id;
		    data['server_name'] = node_id;
		    $scope.active_nodes.push(data);
		})
	    .error(
		function(data, status, headers, config) {
		    $scope.raise_error("Error: " + data);
		}
	    );
    }

    $scope.add_node = function() {
	var active_node_names = {}
	for(var i=0;i< $scope.active_nodes.length;i++){
	    active_node_names[$scope.active_nodes[i].name] = true;
	}
	var i = 1;
	console.log('active_node_name', active_node_names);
	while(i <= Object.keys(active_node_names).length + 1){
	    if(!('Draft ' + i in active_node_names)) break;
	    i++;
	}
	$scope.active_nodes.push({
	    editing: true,
	    name: 'Draft ' + i,
	    server_name: '',
	    data: '<node />'
	});
    }
    
    $scope.delete_node = function(node_id){
	return;
    }

    $scope.deactivate_node = function(node){
	var index= $scope.active_nodes.indexOf(node);
	if(index >= 0){
	    $scope.active_nodes.splice(index,1);
	}
    }

    $scope.edit_node = function(node){
	node.editing = true;
    }
    
    $scope.cancel_node = function(node){
	node.editing = false;
    }
    
    $scope.save_node = function(node){
	if(node.name == ''){
	    toastr.error('You can not use an empty name.');
	    return;
	}
	console.log("ASDAS", node.data);
	$http.post('/get_all_node_names').success(
	    function(data, status, headers, config){
		console.log("data from server", data)
		for(var i = 0; i< data.length; i++){
		    //make sure new node name or a rename doesn't over  
		    if((node.name == data[i] && node.server_name != node.name)){
			toastr.error('You have serious naming issues.');
			return;
		    }
		}

		$http.post("/save_node", {"id":node.name,"data":node.data,"edges":node.edges})
		    .success(
			function(data, status, headers, config) {
			    console.log(data);
			    node.editing = false;
			})
		    .error(
			function(data, status, headers, config) {
			    $scope.raise_error("Error: " + data);
			}
		    );

	    }
	)
    }
}]);



