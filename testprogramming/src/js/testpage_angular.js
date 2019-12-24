

var myApp = angular
	.module("test_module", [])
	.controller("test_controller", ($scope, $http, $sce) => {
			
		
		var para_list = [
			"Test0",
			"Test1",
			"Test2",
			"Test3",
			"Test4"
		];

		var obj_list = [
			{
				name: "Cookie",
				quantity: 3
			},
			{
				name: "Cake",
				quantity: 1
			},
			{
				name: "Donut",
				quantity: 5
			}
		];

		var can_eat = (obj) => {
			if(obj.quantity > 0)
				return true;
			return false;
		}

		var increment_obj = (obj) => {
			obj.quantity++;
		};

		var decrement_obj = (obj) => {
			if(!can_eat(obj))
				return;
			obj.quantity--;
		};	


		$scope.name = "Test Programming Page";
		$scope.para_list = para_list;

		$scope.row_limit = 2;
		$scope.obj_list = obj_list;
		$scope.can_eat = can_eat;
		$scope.increment_obj = increment_obj;
		$scope.decrement_obj = decrement_obj;

	});