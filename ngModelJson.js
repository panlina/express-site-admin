angular.module('.')
	.directive('ngModelJson', () => ({
		require: 'ngModel',
		restrict: 'A',
		link: (scope, element, attr, ngModelController) => {
			ngModelController.$parsers.push(viewValue => {
				try { var modelValue = JSON.parse(viewValue); } catch (e) { }
				return modelValue;
			});
			ngModelController.$formatters.push(modelValue => {
				if (modelValue === undefined) return '';
				return JSON.stringify(modelValue);
			});
			ngModelController.$validators.json = modelValue => modelValue !== undefined;
		}
	}))
