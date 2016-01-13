var app = angular.module('BlueCube.directives', [])

// Directive for the Colour Picker which uses the Spectrum Javascript Library
app.directive('uicolorpicker', function() {
	return {
		restrict: 'E',
		require: 'ngModel',
		scope: false,
		replace: true,

		// Code to be inserted when the directive is used
		template: "<span><input type='text' id='colourpicker'/></span>",

		link: function(scope, element, attrs, ngModel) {
			var input = element.find('input');
			var options = angular.extend({
				color: ngModel.$viewValue,
				// Setup the options we want for the colour picker
				flat: true,
				showInput: false,
				showButtons: false,
				showInitial: false,

				// Called whenever the selected colour is changed, to update the
				// model with the new colour value
				move: function(color) {
					scope.$apply(function() {
						ngModel.$setViewValue(color.toHexString());
					});
				}
			}, scope.$eval(attrs.options));

			ngModel.$render = function() {
				// Sets the initial colour
				input.spectrum('set', ngModel.$viewValue || '');
			};

			// Calls the javascript function on the input element that has the colour
			// picker associated to it, using the provided options from above.
			input.spectrum(options);
		}
	};
});

// Directive that takes a Hex colour value (without the #), and sets the background-color
// css property. It's used to show what colour was picked from the colour picker.
app.directive('backColour', function(){
	return function(scope, element, attrs) {
		attrs.$observe('backColour', function(value) {
			element.css({
				// Set the background colour to the value we were passed
				'background-color': '#' + value
			});
		});
	};
});
