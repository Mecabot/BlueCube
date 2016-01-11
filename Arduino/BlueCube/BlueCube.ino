/*
 *  File:     BlueCube.ino
 *  Version:  0.8
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 *
============================================================================
    APPLICATION SETTINGS (USER EDITABLE)

    - General
    SCRIPT_VERSION            The version of this code
    VERBOSE_MODE              Set to 'true' enables debug output to

    - Bluetooth
    BLUEFRUIT_HWSERIAL_NAME   Name of the HW serial port the Bluefruit BLE
                              device is connected to
    BLUEFRUIT_UART_MODE_PIN   The pin that has been connected to 'MOD'
    MINIMUM_FIRMWARE_VERSION  Minimum firmware version to have some features
    MODE_LED_BEHAVIOUR        LED activity, valid options are
                              "DISABLE" or "MODE" or "BLEUART" or
                              "HWUART"  or "SPI"  or "MANUAL"

    - Patterns (All delays in milliseconds)
    ZIGZAG_DELAY              Delay between ZigZag movemements
    RANDOM_COLOURS_DELAY      Delay before randomly setting the next colour
    FACESWEEP_DELAY           Delay between the movements in the animation
============================================================================ */
// General Defines
#define SCRIPT_VERSION              "0.8"
#define VERBOSE_MODE                true

// Bluetooth Defines
#define BLUEFRUIT_UART_MODE_PIN     5
#define BLUEFRUIT_HWSERIAL_NAME     Serial1
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"

// Pattern Defines
#define ZIGZAG_DELAY                300
#define RANDOM_COLOURS_DELAY        2
#define FACESWEEP_DELAY             100
/*========================================================================== */

// Include for Cube Library
#include "Cube.h"

// Includes for Cube Patterns
#include "ZigZag.h"
#include "RandomColours.h"
#include "FaceSweep.h"

// Inclueds required for the Bluetooth Connectivity
#include <SPI.h>
#include <SoftwareSerial.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Bluetooth.h"

// Define global variables for tracking user defined function items
byte action = 0; // Track which user defined function to run
rgb_t theColour; // Track the colour to use with the user defined function

// Instantiate the classes
// Cube
Cube cube;

// Bluetooth
Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);
Bluetooth bluetooth(&ble, BLE_READPACKET_TIMEOUT);

// Patterns
ZigZag zigzag(cube, ZIGZAG_DELAY);
RandomColours randomColours(cube, RANDOM_COLOURS_DELAY);
FaceSweep facesweep(cube, FACESWEEP_DELAY);

void setup(void)
{
  // Start the standard serial port
  Serial.begin(115200);

  // Set the pin connected to "MOD" on the bluetooth module to output
  pinMode(BLUEFRUIT_UART_MODE_PIN, OUTPUT);

  // Serial port options for control of the Cube using serial commands are:
  // 0: Control via the USB connector (most common).
  // 1: Control via the RXD and TXD pins on the main board.
  // -1: Don't attach any serial port to interact with the Cube.
  cube.begin(0, 115200); // Start on serial port 0 (USB) at 115200 baud

  // Wait for the serial interface, to be established, or for a maximum of
  // 3 seconds.
  byte waitCounter = 0;
  while (waitCounter < 30 && !Serial) {
    delay(100);
    waitCounter++;
  }

  // Print script name and version
  Serial.print("BlueCube v");
  Serial.println(SCRIPT_VERSION);

  // Tell the cube library that the function 'userFunctionHandler' should be
  // called if the user uses the 'user ### colour;' serial command line
  // instruction
  setDelegate(userFunctionHandler);

  /* Initialise the module */
  if (VERBOSE_MODE)
  {
    Serial.println("Initialising Bluetooth");
  }

  if ( !ble.begin(VERBOSE_MODE) )
  { // Bluetooth couldn't be started,
    Serial.println("Couldn't find Bluetooth");
  } else {
    // Bluetooth has been started
    if (VERBOSE_MODE)
    {
      Serial.println("OK!");
    }

    // Disable command echo from Bluetooth
    ble.echo(false);

    if (VERBOSE_MODE)
    {
      // Print Bluetooth information */
      Serial.println("Requesting Bluetooth info");
      ble.info();
    }

    // Bluetooth debug info is a little annoying after this point!.
    ble.verbose(false);

    if (VERBOSE_MODE)
    {
      Serial.println("Set to data mode");
    }

    // LED Activity command is only supported from 0.6.6
    if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
    {
      // Change Mode LED Activity
      ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
    }

    // Set Bluetooth to DATA mode
    ble.setMode(BLUEFRUIT_MODE_DATA);
  }
}

void loop(void)
{
  // Check for any commands from the bluetooth module
  bluetooth.checkForCommand();

  if (cube.inUserMode())
  {
    // The last processed serial command was for a user
    // defined function, so run the action based on the
    // users input
    switch (action)
    {
      case 1:
        zigzag.update(theColour);
        break;
      case 2:
        randomColours.pastels();
        break;
      case 3:
        randomColours.allColours();
        break;
      case 4:
        randomColours.primary();
        break;
      case 5:
        facesweep.update();
        break;
    }
  }
}

void userFunctionHandler(int itemID, rgb_t selectedColour)
{
  /*  This function is called when the user askes for a user defined item via the
   *  serial command line interface. The format is 'user ### colour;', where ### is
   *  a integer, and colour is either the predefined colours, or a HTML colour code.
   *  The colour variable is optional, (so 'user 1;' is valid) but if it is not present
   *  and expected, black is used in it's place.
   */

  // Set the global variables for action and colour based on
  // what the user requested. This will cause them to run
  // repeateadly in the main loop, until the user requests a
  // different action
  action = itemID;
  theColour = selectedColour;

  // Inform the user which action was selected
  switch (action)
  {
    case 1:
      serial->println("ZigZag");
      break;
    case 2:
      serial->println("Random Pastels");
      break;
    case 3:
      serial->println("Random Colours");
      break;
    case 4:
      serial->println("Random Primaries");
      break;
    case 5:
      serial->println("Face Sweep");
      break;
  }
}

