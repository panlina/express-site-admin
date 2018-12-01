angular.module('.')
	.filter('notEmpty', () => object => {
		for (var key in object)
			return true;
		return false;
	})
