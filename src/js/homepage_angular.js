

var db = firebase.firestore();

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

		$scope.myText = (htmlString) => {
			return htmlString;
		}

		myService.getData2().then((promise) => {
			console.log(promise);
			$scope.div_content2 = promise;
			$scope.$apply();
		});

		$scope.trustAsHtml = (html) => {
			return $sce.trustAsHtml(html);
		}
		
	});


