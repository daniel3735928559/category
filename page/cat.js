var app = angular.module('app',[]);

app.controller("CatCommander", ['$scope','$http', '$window', '$timeout', '$location', '$anchorScroll', function($scope, $http, $window, $timeout, $location, $anchorScroll){

    
    $scope.display_login = false;
    $scope.display_index = false;
    
    $scope.toggles = {};

    
    $scope.timestamp = "AAAA";
    $scope.login_message = "";

    $scope.show_ch4_answer = function(){ $scope.ch4_rep_answer = true; $scope.$apply();}
    $scope.hide_ch4_answer = function(){ $scope.ch4_rep_answer = false; $scope.$apply();}


    $scope.nodes = {};
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
    
    $scope.goto_loc = function(loc){
	console.log(loc);
	var old = $location.hash();
        $location.hash(loc);
        $anchorScroll();
	$location.hash(old);
	$scope.hide_all();
    }
    $scope.hide_definitions = function(){
	$scope.display_definitions = false;
    }
    $scope.show_login = function(){
	$scope.display_login = true;
	$timeout(function(){
	    $window.document.getElementById('login_username').focus();
	});
    }
    $scope.hide_login = function(){
	$scope.display_login = false;
    }
    $scope.prep_comment = function(par_id){
	$scope.commenting_id = par_id;
    }
    $scope.end_comment = function(){
	$scope.commenting_id = "";
    }
    $scope.activate = function(par_id){
	$scope.raise_error("ACTIVE: " + par_id);
	$timeout(function(){
	    $window.document.getElementById('commentbox_'+par_id).focus();
	});
	$scope.active_thread = par_id;
    }
    $scope.deactivate = function(par_id){
	$scope.active_thread = "";
    }
    $scope.remove_comment = function(cid){
	var comment_obj = {"token":$scope.auth_token,"index":$scope.auth_index,"username":$scope.username,"cid":cid};
	$http.post("/delcomment", JSON.stringify(comment_obj)).success(
	    function(data, status, headers, config) {
		console.log(JSON.stringify(data));
		$scope.refresh_comments();
	    }).error(
		function(data, status, headers, config) {
		    $scope.raise_error("Error removing comment: " + data);
		});
    }
    $scope.count_comments = function(par_id){
	if(par_id in $scope.comments) return $scope.comments[par_id].length;
	return 0;
    }
    $scope.add_comment = function(){
	var comment_obj = {"token":$scope.auth_token,"index":$scope.auth_index,"username":$scope.username,"par_id":$scope.active_thread,"text":$scope.comment[$scope.active_thread].trim()};
	if(comment_obj.text == ""){
	    $scope.raise_error("Empty Comment");
	    return;
	}
	$http.post("/addcomment", JSON.stringify(comment_obj)).success(
	    function(data, status, headers, config) {
		console.log(JSON.stringify(data));
		$scope.refresh_comments();
	    }).error(
		function(data, status, headers, config) {
		    $scope.raise_error("Error adding comment: " + data);
		});
	//$scope.comments.push(comment_obj);
	$scope.comment[$scope.active_thread] = "";
	//$scope.commenting_id = "";
	console.log(JSON.stringify($scope.comments));
    }
    // $scope.hmac_calc = function()
    // {
    // 	var shaObj = new jsSHA(login.password, "ASCII");
    // 	return shaObj.getHMAC($scope.timestamp, "ASCII", "SHA-256", "HEX");
    // }
    // $scope.sign_in = function(){
    // 	console.log(JSON.stringify($scope.login));
    // 	$scope.username = $scope.login.username;
    // 	$http.post("/login", JSON.stringify($scope.login)).success(
    // 	    function(data, status, headers, config) {
    // 		console.log(JSON.stringify(data));
    // 		if(data['success'] == "1"){
    // 		    $scope.auth_token = data['token'];
    // 		    $scope.auth_index = data['index'];
    // 		    $scope.login_message = "Welcome "+$scope.username;
    // 		    $scope.hide_all();
    // 		    $scope.signed_in = true;
    // 		    $cookies.put('username',$scope.username);
    // 		    $cookies.put('token',$scope.auth_token);
    // 		    $cookies.put('index',$scope.auth_index);
    // 		}
    // 		else{
    // 		    $scope.raise_error("Bad credentials");
    // 		    $scope.login_message = "Bad credentials";
    // 		}
    // 	    }).error(
    // 		function(data, status, headers, config) {
    // 		    $scope.raise_error("Error logging in: " + data);
    // 		}
    // 	    );
	
    // 	$scope.login.password = "";
    // }
    // $scope.sign_out = function(){
    // 	$http.post("/logout", JSON.stringify({'token':$scope.auth_token,'index':$scope.auth_index,'username':$scope.username})).success(
    // 	    function(data, status, headers, config) {
    // 		console.log(JSON.stringify(data));
    // 		if(data['success'] == "1"){
    // 		    $scope.username = "";
    // 		    $scope.auth_token = "";
    // 		    $scope.auth_index = "";
    // 		    $scope.signed_in = false;
    // 		    $cookies.remove('username');
    // 		    $cookies.remove('token');
    // 		    $cookies.remove('index');
    // 		}
    // 		else{
    // 		    $scope.raise_error("Error");
    // 		}
    // 	    }).error(function(data, status, headers, config) {
    // 		$scope.raise_error("Error logging out: " + data);
    // 	    });
    // }
    // $scope.verify_login = function(){
    // 	console.log('VERIFY token',$scope.auth_token,"index",$scope.auth_index,"username",$scope.username);
    // 	if($cookies.get('token') != null && $cookies.get('index') != null){
    // 	    $http.post("/verify", JSON.stringify({'token':$scope.auth_token,"index":$scope.auth_index,"username":$scope.username})).success(function(data, status, headers, config) {
    // 		console.log(JSON.stringify(data));
    // 		if(data['success'] == "0"){
    // 		    $scope.signed_in = false;
    // 		    $scope.username = "";
    // 		    $scope.auth_token = "";
    // 		    $scope.auth_index = "";
    // 		}
    // 		else{
    // 		    console.log("Logged in");
    // 		    $scope.signed_in = true;
    // 		}
    // 	    }).error(function(data, status, headers, config) {
    // 		$scope.raise_error("Error verifying access token: " + data);
    // 	    });
    // 	}
    // 	else{
    // 	    $scope.signed_in = false;
    // 	    $scope.username = "";
    // 	    $scope.auth_token = "";
    // 	    $scope.auth_index = "";
    // 	}
    // }
    $scope.exc_toggle = function(s){
	if(!(s in $scope.toggles))
	    $scope.toggles[s] = true;
	else
	    $scope.toggles[s] = !($scope.toggles[s]);
    }
    //$scope.setup();
}]);

