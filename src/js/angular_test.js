


var db = firebase.firestore();
var data;

var promise = db.collection("entries").get().then((snapshot) => {
	snapshot.forEach((doc) => {
		data = doc.data().data;
	});
});

function createElementFromHTML(htmlString) {
	var p = document.createElement('p');
	p.innerHTML = htmlString;
	return p;
}

function outputHTML(htmlString){
	return htmlString;
}

var myApp = angular
	.module("myModule", [])
	.factory("myService", () => {
		return {
			getData: () => {
				var promise = db.collection("entries").get().then((snapshot) => {
					return snapshot.docs[0].data().data;
				});
				return promise;
			},
			getData2: () => {
				var promise = db.collection("whole_entry").get().then((snapshot) => {
					return snapshot.docs[0].data().data;
				});
				return promise;
			}
		}
	})
	.controller("myController", ($scope, $http, $sce, myService) => {

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

		$scope.myText = (htmlString) => {
			return htmlString;
		}
			
		/*
		$http.get("src/JSON/entries.json").then((response) => {
			console.log(response);
			$scope.div_content = response.data;	
		});
		*/
		/*
		myService.getData().then((promise) => {
			console.log(promise);
			$scope.div_content = promise;
			$scope.$apply();
		});
		*/
		
		myService.getData2().then((promise) => {
			console.log(promise);
			$scope.div_content2 = promise;
			$scope.$apply();
		});

		$scope.trustAsHtml = (html) => {
			return $sce.trustAsHtml(html);
		}


		/*
		$scope.div_content = [
			{
				img:[
					{
						name: "data_viz",
						flag: "/src/img/data_viz.png"
					}
				],
				title:"TestTest", 
				type: 0,
				info: [
					"TestTest", "TestTest"
				]
			},
			{
				img:[
					{
						name: "brand_recog",
						flag: "/src/img/brand_recog.jpg"
					}
				],
				title:"TestTest1", 
				type: 1,
				info: [
					"TestTest1", "TestTest1"
				]
			}
		];*/
		
	});


