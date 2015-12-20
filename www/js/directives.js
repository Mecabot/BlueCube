angular.module('BlueCube.directives', [])

.directive('uicolorpicker', function() {
		return {
			restrict: 'E',
			require: 'ngModel',
			scope: false,
			replace: true,
			template: "<span><input type='text' id='colourpicker'/></span>",
			link: function(scope, element, attrs, ngModel) {
							var input = element.find('input');
							var options = angular.extend({
								color: ngModel.$viewValue,
								flat: true,
								showInput: false,
								showButtons: false,
								showInitial: true,
								move: function(color) {
												scope.$apply(function() {
													ngModel.$setViewValue(color.toHexString());
												});
											}
							}, scope.$eval(attrs.options));

							ngModel.$render = function() {
								input.spectrum('set', ngModel.$viewValue || '');
							};

							input.spectrum(options);
						}
		};
});
