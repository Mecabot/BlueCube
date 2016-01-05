angular.module('BlueCube.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

})

.controller('AllCtrl', function($ionicPlatform, $scope, $cubeAction, ColourService, $localstorage) {

  $scope.live = true;
  $scope.useSelectedColourButton = false;

	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		var initialColour = $localstorage.get('selectedColour');
		$scope.hexColour = initialColour;
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};
		$scope.colours = ColourService.list();

		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.hexColour = newValue.substring(1);
				$localstorage.set('selectedColour', $scope.hexColour);
				if ($scope.live == true) {
				  var message = "all " + $scope.hexColour + ";";
				  $cubeAction.sendMessage(message, true);
				}
			}
		});
	});

  $scope.liveChanged = function() {
    if ($scope.live == false) {
      $scope.live = true;
      $scope.useSelectedColourButton = false;
    } else {
      $scope.live = false;
      $scope.useSelectedColourButton = true;
    }
  };

  $scope.sendSelectedColour = function(selectedColour) {
    if (selectedColour == null) {
      selectedColour = $scope.hexColour;
    }
    $localstorage.set('selectedColour', selectedColour);
    var message = "all " + selectedColour + ";";
    $cubeAction.sendMessage(message, true);
  };

	$scope.addUserColour = function () {
		newColour = $scope.hexColour;
		ColourService.add(newColour);
	};

	$scope.deleteUserColour = function (id) {
		ColourService.delete(id);
	}

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		ColourService.reorder(item, fromIndex, toIndex);
	}
})

.controller('ShiftCtrl', function($ionicPlatform, $scope, $cubeAction) {
	$scope.up = function () {
		$cubeAction.sendMessage('shift Z +;', true);
	}

	$scope.down = function () {
		$cubeAction.sendMessage('shift Z -;', true);
	}

	$scope.left = function () {
		$cubeAction.sendMessage('shift X -;', true);
	}

	$scope.right = function () {
		$cubeAction.sendMessage('shift X +;', true);
	}

	$scope.back = function () {
		$cubeAction.sendMessage('shift Y +;', true);
	}

	$scope.forward = function () {
		$cubeAction.sendMessage('shift Y -;', true);
	}
})

.controller('SetCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$scope.cube = [];

	$ionicPlatform.ready(function() {
    $scope.selectedColour = $localstorage.get('selectedColour');

    $scope.setLED = function (id) {
      var colourToUse = "BLACK";
      if ($scope.cube[id] == true) {
        colourToUse = $localstorage.get('selectedColour');
      }

      var message = "set " + $cubeAction.lookupCoords(id) + " " + colourToUse + ";";
			$cubeAction.sendMessage(message, true);
    }

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

	});
})

.controller('SetPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
    $scope.values = {
      axis: 'X',
      offset: '0',
    };
    $scope.selectedColour = $localstorage.get('selectedColour');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
  });

  $scope.setPlane = function() {
    var message = "setplane " + $scope.values.axis + " " + $scope.values.offset + " " + $scope.selectedColour + ";";
    $cubeAction.sendMessage(message, true);
  };
})

.controller('CopyPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
    $scope.values = {
      axis: 'X',
      fromOffset: '0',
      toOffset: '1',
    };
  });

  $scope.copyPlane = function() {
    var message = "copyplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + ";";
    $cubeAction.sendMessage(message, true);
  };
})

.controller('MovePlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
    $scope.values = {
      axis: 'X',
      fromOffset: '0',
      toOffset: '1',
    };
    $scope.selectedColour = $localstorage.get('selectedColour');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
  });

  $scope.movePlane = function() {
    var message = "moveplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + " " + $scope.selectedColour + ";";
    $cubeAction.sendMessage(message, true);
  };

})

.controller('LineCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];

	$ionicPlatform.ready(function() {
    $scope.selectedColour = $localstorage.get('selectedColour');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.drawLine = function() {
	  var message = "line ";
	  var selected = 0;
	  for (i = 0; i <= 64; i++) {
	    if ($scope.cube[i] == true) {
	      selected = selected + 1;
	      message = message + $cubeAction.lookupCoords(i) + " ";
	    }
	  }

	  if (selected == 2) {
      // Clear the selected points
   	  for (i = 0; i <= 64; i++) {
        $scope.cube[i] = null;
   	  }

	    // Draw the line
	    message = message + $localstorage.get('selectedColour') + ";";
	    $cubeAction.sendMessage(message, true);
	  } else {
	    // Tell them to pick again
	    $cordovaDialogs.alert('Please select only 2 points', 'Line', 'OK');
	  }
	};
})

.controller('BoxCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];
	var secondaryColourSelector = false;
	var cachedColour = "";

	$ionicPlatform.ready(function() {
    $scope.style = {
      boxStyle: '0',
    };
    $scope.selectedColour = $localstorage.get('selectedColour');
    $scope.otherColour = $localstorage.get('otherColour');
    $scope.showSecontaryColour = false;

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModalPrimary = function() {
		  secondaryColourSelector = false;
			$scope.modal.show()
		};

		$scope.openModalSecondary = function() {
		  secondaryColourSelector = true;
		  cachedColour = $localstorage.get('selectedColour');
		  var otherColour = $localstorage.get('otherColour');
		  $localstorage.set('selectedColour', otherColour);
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
		  if (secondaryColourSelector) {
  			$localstorage.set('otherColour', selectedColour);
  			$scope.otherColour = selectedColour;
		  } else {
  			$localstorage.set('selectedColour', selectedColour);
  			$scope.selectedColour = selectedColour;
      }
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			if (secondaryColourSelector) {
        $scope.otherColour = $localstorage.get('selectedColour');
        $localstorage.set('selectedColour', cachedColour);
        $localstorage.set('otherColour', $scope.otherColour);
      } else {
  			$scope.selectedColour = $localstorage.get('selectedColour');
      }
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

  $scope.styleSelection = function() {
    if (parseInt($scope.style.boxStyle) <= 2) {
      $scope.showSecontaryColour = false;
    } else {
      $scope.showSecontaryColour = true;
    }
  }

	$scope.drawBox = function() {
	  var message = "box ";
	  var selected = 0;
	  for (i = 0; i <= 64; i++) {
	    if ($scope.cube[i] == true) {
	      selected = selected + 1;
	      message = message + $cubeAction.lookupCoords(i) + " ";
	    }
	  }

	  if (selected == 2) {
      // Clear the selected points
   	  for (i = 0; i <= 64; i++) {
//        $scope.cube[i] = null;
   	  }

	    message = message + $localstorage.get('selectedColour') + " " + $scope.style.boxStyle;
      if (parseInt($scope.style.boxStyle) <= 2) {
        message = message + ";";
  	    $cubeAction.sendMessage(message, true);
  	  } else {
        message = message + " " + $localstorage.get('otherColour') + ";";
  	    $cubeAction.sendMessage(message, true);  	  }
	  } else {
	    // Tell them to pick again
	    $cordovaDialogs.alert('Please select only 2 points', 'Box', 'OK');
	  }
	};
})

.controller('SphereCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];
	var secondaryColourSelector = false;
	var cachedColour = "";

	$ionicPlatform.ready(function() {
    $scope.style = {
      sphereStyle: '0',
      sphereSize: '3',
    };
    $scope.selectedColour = $localstorage.get('selectedColour');
    $scope.otherColour = $localstorage.get('otherColour');
    $scope.showSecontaryColour = false;

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModalPrimary = function() {
		  secondaryColourSelector = false;
			$scope.modal.show()
		};

		$scope.openModalSecondary = function() {
		  secondaryColourSelector = true;
		  cachedColour = $localstorage.get('selectedColour');
		  var otherColour = $localstorage.get('otherColour');
		  $localstorage.set('selectedColour', otherColour);
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
		  if (secondaryColourSelector) {
  			$localstorage.set('otherColour', selectedColour);
  			$scope.otherColour = selectedColour;
		  } else {
  			$localstorage.set('selectedColour', selectedColour);
  			$scope.selectedColour = selectedColour;
      }
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			if (secondaryColourSelector) {
        $scope.otherColour = $localstorage.get('selectedColour');
        $localstorage.set('selectedColour', cachedColour);
        $localstorage.set('otherColour', $scope.otherColour);
      } else {
  			$scope.selectedColour = $localstorage.get('selectedColour');
      }
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

  $scope.styleSelection = function() {
    if (parseInt($scope.style.sphereStyle) == 0) {
      $scope.showSecontaryColour = false;
    } else {
      $scope.showSecontaryColour = true;
    }
  }

	$scope.drawSphere = function() {
	  var message = "sphere ";
	  var selected = 0;
	  for (i = 0; i <= 64; i++) {
	    if ($scope.cube[i] == true) {
	      selected = selected + 1;
	      message = message + $cubeAction.lookupCoords(i) + " ";
	    }
	  }

	  if (selected == 1) {
      // Clear the selected points
   	  for (i = 0; i <= 64; i++) {
//        $scope.cube[i] = null;
   	  }

	    message = message + " " + $scope.style.sphereSize + " " + $localstorage.get('selectedColour');
      if (parseInt($scope.style.sphereStyle) == 0) {
        message = message + ";";
  	    $cubeAction.sendMessage(message, true);
  	  } else {
        message = message + " " + $localstorage.get('otherColour') + ";";
  	    $cubeAction.sendMessage(message, true);
  	  }
	  } else {
	    // Tell them to pick again
	    $cordovaDialogs.alert('Please select only 1 point', 'Sphere', 'OK');
	  }
	};
})

.controller('ConnectCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading, $localstorage, $ionicSideMenuDelegate, $translate) {
	$scope.connectButton = true;
	$scope.disconnectButton = false;

    if ($localstorage.get('autoConnect') == "true") {
      $scope.autoConnect = true;
    } else {
      $scope.autoConnect = false;
    }

		// Function called every time this view is shown
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.checkConnected();
		});

		$scope.$on('$ionicView.afterEnter', function() {
			if ($scope.autoConnect == true) {
        $cordovaBluetoothSerial.isConnected().then(
          function() {
            // Yep - do nothing
          },
          function() {
            $scope.connect();
          }
        );
			}
		});

	$ionicPlatform.ready(function() {

    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
           $translate.use(language.value).then(function(data) {
           }, function(error) {
           });
        }, null);
    }
  });

     $scope.autoConnectChanged = function() {
       if ($scope.autoConnect == false) {
         $scope.autoConnect = true;
         $localstorage.set('autoConnect', 'true');
         $cordovaBluetoothSerial.isConnected().then(
           function() {
             // Yep - do nothing
           },
           function() {
             $scope.connect();
           }
         );
       } else {
         $scope.autoConnect = false;
         $localstorage.set('autoConnect', 'false');
       }
     };

		// Functions for showing and hiding the loading overlay
		$scope.show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-light"></ion-spinner><br>Connecting to BlueCube'
			});
		};

		$scope.hide = function() {
			$ionicLoading.hide();
		};

		// Function to Connect to the BlueCube
		$scope.connect = function() {
			$scope.show();

			// Check if Bluetooth is enabled
			$scope.logText = "Starting Connection Procedures<br>";
			$cordovaBluetoothSerial.isEnabled().then(
				function() {
					// Bluetooth is enabled
					$scope.logText = $scope.logText + "Bluetooth is enabled...<br>";

					// Find possible devices to connect to
					$scope.logText = $scope.logText + "Searching for Bluetooth Devices<br>";
					var bluetoothDeviceID = null;		// Tracker for the device to connect to

					$cordovaBluetoothSerial.list().then(
						function(peripherals) {
							// Search for devices is complete
							if (peripherals.length > 0) {
								// Items found, so list Bluetooth Devices (that the library knows about)
								$scope.logText = $scope.logText + JSON.stringify(peripherals) + "<br>";

								// Get the first device that we find's ID.
								bluetoothDeviceID = peripherals[0].id;

								// Connect to the device
								$cordovaBluetoothSerial.connect(bluetoothDeviceID).then(
									function() {
										// Connected
										$localstorage.set('bluetoothUUID', bluetoothDeviceID);
										$scope.logText = "BlueCube (" + bluetoothDeviceID + ") is Connected<br>";
										$scope.connectButton = false;
										$scope.disconnectButton = true;
										$scope.hide();
										$ionicSideMenuDelegate.toggleLeft();
									},
									function() {
										// Failed to connect
										$scope.logText = "ERROR: Failed to connect to BlueCube (" + bluetoothDeviceID + ")<br>";
										$scope.connectButton = true;
										$scope.disconnectButton = false;
										$scope.hide();
									}
								);
							} else {
								// No devices found
								$scope.logText = "Error: No BlueCube found to connect to<br>";
								$scope.connectButton = true;
								$scope.disconnectButton = false;
								$scope.hide();
							}
						},
						function(reason) {
							// Error finding Bluetooth devices.
							$scope.logText = "ERROR: Listing Bluetooth Devices Failed: " + reason + "<br>";
							$scope.connectButton = true;
							$scope.disconnectButton = false;
							$scope.hide();
						}
					);

				},
				function() {
					// Bluetooth is not enabled
					$scope.logText = "ERROR: Bluetooth is *NOT* enabled. Please enable it and try again.<br>";
					$scope.connecyButton = false;
					$scope.disconnectButton = false;
					$scope.hide();
				}
			);
		};

		// Function to Disconnect from the BlueCube
		$scope.disconnect = function() {
			$cordovaBluetoothSerial.disconnect().then(
				function() {
					$scope.logText = "Disconnected from BlueCube (" + $localstorage.get('bluetoothUUID') + ")<br>";
					$scope.connectButton = true;
					$scope.disconnectButton = false;
				},
				function(error) {
					$scope.logText = "ERROR: Failed to disconnect: " + error + "<br>";
					$scope.disconnectButton = true;
				}
			);
		};

		// Function to setup the state of the view
		$scope.checkConnected = function() {
			// Check current connection status
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					$scope.logText = "BlueCube (" + $localstorage.get('bluetoothUUID') + ") is Connected<br>";
					$scope.disconnectButton = true;
					$scope.connectButton = false;
				},
				function() {
					$scope.logText = "Not connected to a BlueCube<br>";
					$scope.connectButton = true;
					$scope.disconnectButton = false;
					//$scope.connect();
				}
			);
		};
})

.controller('UserDefinedCtrl', function($ionicPlatform, $scope, $cubeAction) {
})

.controller('StaticCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs, StaticFavouritesService) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

  $scope.staticCommands = [];

	$ionicPlatform.ready(function() {
    $scope.favourites = StaticFavouritesService.list();
    $scope.staticCommandsData = {};
    $scope.staticCommandsData.name = '';
    $scope.staticCommandsData.cmds = [];
    $scope.saveButton = false;

		$ionicModal.fromTemplateUrl('templates/staticCreator.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      $scope.staticCommands = [];
 	    $scope.staticCommandsData.name = '';
 	    $scope.staticCommandsData.cmds = [];
 	    $scope.saveButton = false;
    });

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

    $scope.saveFavourite = function() {
      if ($scope.staticCommandsData.name == "") {
        $cordovaDialogs.alert('Please provide a name', 'Error', 'OK');
      } else {
        if ($scope.staticCommandsData.cmds.length == 0) {
          $cordovaDialogs.alert('Please select at least 1 item', 'Error', 'OK');
        } else {
    		  StaticFavouritesService.add($scope.staticCommandsData.name, $scope.staticCommandsData.cmds);
    	    $scope.modal.hide();
    	  }
      }
    }

	  $scope.deleteFavourite = function (id) {
		  StaticFavouritesService.delete(id);
	  }

	  $scope.reorderFavourites = function(item, fromIndex, toIndex) {
		  StaticFavouritesService.reorder(item, fromIndex, toIndex);
	  }
/*
		$scope.allOn = false;
		$scope.selectedColour = $localstorage.get('selectedColour');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		// All Red
		$scope.allRed = function() {
			var message = "all RED;";
			$cubeAction.sendMessage(message, true);
		};

		// All Hex - Green Colour
		$scope.allHex = function() {
			var message = "all 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		// All Black
		$scope.allBlack = function() {
			var message = "all BLACK;";
			$cubeAction.sendMessage(message, true);
		};

		// SET 000 RED
		$scope.setRed = function() {
			var message = "set 000 RED;";
			$cubeAction.sendMessage(message, true);
		};

		// SET 100 HEX - Green Colour
		$scope.setHex = function() {
			var message = "set 100 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		// Setplane X 2 BLUE;
		$scope.setPlaneBlue = function() {
			var message = "setplane X 2 BLUE;";
			$cubeAction.sendMessage(message, true);
		};

		// Setplane Y 1 Hex - Green;
		$scope.setPlaneHex = function() {
			var message = "setplane Y 1 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		$scope.allOnChanged = function() {
			if ($scope.allOn == false) {
				$scope.allOn = true;
				$cubeAction.sendMessage("!B11", true);
			} else {
				$scope.allOn = false;
				$cubeAction.sendMessage("!B10", true);
			}
		};
*/
	});
})

.controller('HistoryCtrl', function($ionicPlatform, $scope, $cubeAction, HistoryService, $localstorage) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		$scope.commands = HistoryService.list();
	});

  $scope.replayHistoryItem = function(command) {
    $cubeAction.sendMessage(command, false);
  };

//	$scope.addUserColour = function () {
//		newColour = $scope.hexColour;
//		ColourService.add(newColour);
//	};

	$scope.deleteHistoryItem = function (id) {
		HistoryService.delete(id);
	}

	$scope.reorderHistoryItem = function(item, fromIndex, toIndex) {
		HistoryService.reorder(item, fromIndex, toIndex);
	}
})

.controller('SettingsCtrl', [ '$scope', '$state', function($scope, $state) {

}])

.controller('AboutCtrl', function($ionicPlatform, $scope, $cordovaDevice, $cordovaAppVersion) {
	$ionicPlatform.ready(function() {
		// getting device infor from $cordovaDevice
		var device = $cordovaDevice.getDevice();

		$scope.manufacturer = device.manufacturer;
		$scope.model = device.model;
		$scope.platform = device.platform;
		$scope.version = device.version;
		$scope.uuid = device.uuid;

		$cordovaAppVersion.getVersionNumber().then(function (version) {
			$scope.appVersion = version;
		}, false);
		$cordovaAppVersion.getVersionCode().then(function (build) {
			$scope.appBuild = build;
		}, false);

    if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
        $scope.language = language.value;
      }, null);
    }

  });
})

.controller('ColourPickerCtrl', function($ionicPlatform, $scope, ColourService, $localstorage) {

	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		var initialColour = $localstorage.get('selectedColour');
		$scope.hexColour = initialColour;
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};
		$scope.colours = ColourService.list();

		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.hexColour = newValue.substring(1);
				$localstorage.set('selectedColour', $scope.hexColour);
			}
		});
	});

	$scope.addUserColour = function () {
		newColour = $scope.hexColour;
		ColourService.add(newColour);
	};

	$scope.deleteUserColour = function (id) {
		ColourService.delete(id);
	}

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		ColourService.reorder(item, fromIndex, toIndex);
	}
})

.controller('StaticCreatorCtrl', function($ionicPlatform, $scope, HistoryService, $localstorage) {
  var uniqueID = 1;


	$scope.dataModal = {
  	showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		$scope.commands = HistoryService.list();
  });

	$scope.showSaveButton = function () {
    if ($scope.staticCommands.length >= 1) {
      $scope.saveButton = true;
    } else {
      $scope.saveButton = false;
    }
  }

	$scope.addStaticCommand = function (command) {
	  var item = {
	                id: uniqueID,
	                cmd: command,
	              };

		uniqueID = uniqueID + 1;
		$scope.staticCommands.push(item);
		$scope.staticCommandsData.cmds = $scope.staticCommands;
		$scope.showSaveButton();
	};

	$scope.deleteStaticCommand = function (id) {
		for (i in $scope.staticCommands) {
			if ($scope.staticCommands[i].id == id) {
				$scope.staticCommands.splice(i, 1);
			}
		}
		$scope.staticCommandsData.cmds = $scope.staticCommands;
		$scope.showSaveButton();
	};

	$scope.reorderStaticCommands = function(item, fromIndex, toIndex) {
		$scope.staticCommands.splice(fromIndex, 1);
		$scope.staticCommands.splice(toIndex, 0, item);
		$scope.staticCommandsData.cmds = $scope.staticCommands;
	};
});
