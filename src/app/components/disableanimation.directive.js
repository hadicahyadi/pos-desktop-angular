(function() {
	'use strict';

	angular
	.module('posapp')
	.directive('ngAnimationDisabled', function ($animate) {
		return {
			restrict: 'C',
			link: function (scope, element, attrs) {
				$animate.enabled(element, false);
			}
		};
	});

})();
