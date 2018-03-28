var app = angular.module('App.directives', []);

app.directive('test', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			
		}
	}
}]);

app.directive('calendar', ["$timeout", function($timeout) {
	return {
		scope: {
			id: 	"@",
			name: 	"="
		},
		restrict: 'E',
		controller:'',
		/*templateUrl: '/asset/sport/templates/users/calendar.html'*/
		template: '<div class="calendar"></div>',
		replace:true,
		transclude:true,
		link: function(scope, element, attr) {
			
		}
	}
}]);

