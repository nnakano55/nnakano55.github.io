
var myApp = angular
	.module("myModule", [])
	.controller("myController", ($scope) => {

		var employee = {
			firstname: "David",
			lastname: "Hastings",
			gender: "Male"
		};

		var employee2 = {
			firstname: "Ben",
			lastname: "Hastings",
			gender: "Male"
		};

		var brand_recog = {
			name: "brand_recog",
			class: "cmps146",
			flag: "/src/img/brand_recog.jpg"
		}

		var countries = [

			{
				name: "UK",
				cities: [
					{name:"London"},
					{name:"Manchester"},
					{name:"Birmingham"}
				]
			},
			{
				name: "USA",
				cities: [
					{name:"Los Angeles"},
					{name:"Chicago"},
					{name:"Houston"}
				]
			},
			{
				name: "Japan",
				cities: [
					{name:"Tokyo"},
					{name:"Kyoto"},
					{name:"Akibahara"}
				]
			}

		];


		var technologies = [
			{name:"C#", likes: 0, dislikes:0},
			{name:"ASP.NET", likes: 0, dislikes:0},
			{name:"SQL Server", likes: 0, dislikes:0},
			{name:"AngularJS", likes: 0, dislikes:0}
		];

		$scope.employee = employee;
		$scope.employee2 = employee2;
		
		$scope.employees = [
			{firstname: "Ben", lastname: "Hastings", gender: "Male", salary: 55000},
			{firstname: "Sara", lastname: "Paul", gender: "Female", salary: 68000},
			{firstname: "Mark", lastname: "Holland", gender: "Male", salary: 99000},
			{firstname: "Pam", lastname: "Pammy", gender: "Female", salary: 15000},
			{firstname: "Todd", lastname: "Barber", gender: "Male", salary: 599900},
		];

		$scope.employees2 = [
			{firstname: "Ben", dateOfBirth: new Date("November 23, 1980"), gender: "Male", salary: 55000.788},
			{firstname: "Sara", dateOfBirth: new Date("May 05, 1970"), gender: "Female", salary: 68000},
			{firstname: "Mark", dateOfBirth: new Date("August 15, 1974"), gender: "Male", salary: 99000},
			{firstname: "Pam", dateOfBirth: new Date("October 27, 1979"), gender: "Female", salary: 15000},
			{firstname: "Todd", dateOfBirth: new Date("December 30, 1983"), gender: "Male", salary: 599900},
		];

		$scope.technologies = technologies;

		$scope.incrementLikes = (technology) => {
			technology.likes++;
		};

		$scope.incrementDislikes = (technology) => {
			technology.dislikes++;
		};


		$scope.brand_recog = brand_recog;

		$scope.countries = countries;

		$scope.message = "Hello, Angular!";

		$scope.row_limit = 3;
	});



