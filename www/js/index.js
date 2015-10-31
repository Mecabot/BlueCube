var log = function(message) {
        console.log(message);
        logDiv.innerHTML = logDiv.innerHTML + message + "<br>";
    };
    
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event.
    onDeviceReady: function() {
		
	  StatusBar.overlaysWebView( false );
	  StatusBar.backgroundColorByHexString('#ffffff');
	  StatusBar.styleDefault();
	  
	  log("DeviceReady");
	  
	  // Check Bluetooth is Enabled
	  bluetoothSerial.isEnabled(
        function() {
            log("Bluetooth is enabled");
        }, function() {
            log("Bluetooth is *not* enabled");
        });

	    // List found Bluetooth Devices (that the library knows about)
        bluetoothSerial.list(successList, failureList);
        var bluetoothDeviceID;
        
        function successList(peripherals) {
            log(JSON.stringify(peripherals));
            bluetoothDeviceID = peripherals[0].id;
        }

        function failureList(reason) {
            log(reason || "Listing peripherals failed");
        }

    },

};

app.initialize();