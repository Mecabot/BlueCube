var app = angular.module('BlueCube.directives', [])

app.directive('uicolorpicker', function() {
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
				showInitial: false,
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

app.directive('backColour', function(){
	return function(scope, element, attrs) {
		attrs.$observe('backColour', function(value) {
			element.css({
				'background-color': '#' + value
			});
		});
	};
});
