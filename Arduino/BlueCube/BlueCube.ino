/*
 *  File:     BlueCube.ino 
 *  Version:  0.8
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 *
============================================================================
    APPLICATION SETTINGS (USER EDITABLE)

    - General
    VERBOSE_MODE              Set to 'true' enables debug output to

    BLUEFRUIT_HWSERIAL_NAME   Name of the HW serial port the Bluefruit BLE
                              device is connected to
    
    - Bluetooth
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
#define VERBOSE_MODE                true
#define BLUEFRUIT_UART_MODE_PIN     5
#define BLUEFRUIT_HWSERIAL_NAME     Serial1
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"
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

// Patterns
ZigZag zigzag(cube, ZIGZAG_DELAY);
RandomColours randomColours(cube, RANDOM_COLOURS_DELAY);
FaceSweep facesweep(cube, FACESWEEP_DELAY);

// Bluetooth
Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);
Bluetooth bluetooth(&ble, BLE_READPACKET_TIMEOUT);

void setup(void)
{
  // Serial port options for control of the Cube using serial commands are:
  // 0: Control via the USB connector (most common).
  // 1: Control via the RXD and TXD pins on the main board.
  // -1: Don't attach any serial port to interact with the Cube.
  cube.begin(0, 115200); // Start on serial port 0 (USB) at 115200 baud
  
  // Tell the cube library that the function 'userFunctionHandler' should be
  // called if the user uses the 'user ### colour;' serial command line
  // instruction
  setDelegate(userFunctionHandler);

  pinMode(BLUEFRUIT_UART_MODE_PIN, OUTPUT);

  Serial.begin(115200);
  Serial.println(F("Adafruit Bluefruit App Controller Example"));
  Serial.println(F("-----------------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    Serial.println(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  Serial.println("MAC Address:");
  ble.sendCommandCheckOK("AT+BLEGETADDR");
  Serial.println();
  
  Serial.println(F("Please use Adafruit Bluefruit LE app to connect in Controller mode"));
  Serial.println(F("Then activate/use the sensors, color picker, game controller, etc!"));
  Serial.println();

  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  while (! ble.isConnected()) {
      delay(500);
  }

  Serial.println(F("******************************"));

  // LED Activity command is only supported from 0.6.6
  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
  {
    // Change Mode LED Activity
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
  }

  // Set Bluefruit to DATA mode
  Serial.println( F("Switching to DATA mode!") );
  ble.setMode(BLUEFRUIT_MODE_DATA);

  Serial.println(F("******************************"));

}

void loop(void)
{
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

