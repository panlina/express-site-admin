angular.module('.')
	.directive('ngModelControllerRef', $parse => ({
		require: 'ngModel',
		restrict: 'A',
		link: (scope, element, attr, ngModelController) => {
			$parse(attr.ngModelControllerRef).assign(scope, ngModelController);
		}
	}))
