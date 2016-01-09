/*********************************************************************
 This is an example for our nRF51822 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution
*********************************************************************/

#include <SPI.h>
#include <SoftwareSerial.h>
#include "Cube.h"

Cube cube;

byte action = 0; // Track which user defined function to run
rgb_t theColour; // Track the colour to use with user defined function

#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"

/*=========================================================================
    APPLICATION SETTINGS

    FACTORYRESET_ENABLE       Perform a factory reset when running this sketch
   
                              Enabling this will put your Bluefruit LE module
                              in a 'known good' state and clear any config
                              data set in previous sketches or projects, so
                              running this at least once is a good idea.
   
                              When deploying your project, however, you will
                              want to disable factory reset by setting this
                              value to 0.  If you are making changes to your
                              Bluefruit LE device via AT commands, and those
                              changes aren't persisting across resets, this
                              is the reason why.  Factory reset will erase
                              the non-volatile memory where config data is
                              stored, setting it back to factory default
                              values.
       
                              Some sketches that require you to bond to a
                              central device (HID mouse, keyboard, etc.)
                              won't work at all with this feature enabled
                              since the factory reset will clear all of the
                              bonding data stored on the chip, meaning the
                              central device won't be able to reconnect.
    MINIMUM_FIRMWARE_VERSION  Minimum firmware version to have some new features
    MODE_LED_BEHAVIOUR        LED activity, valid options are
                              "DISABLE" or "MODE" or "BLEUART" or
                              "HWUART"  or "SPI"  or "MANUAL"
    -----------------------------------------------------------------------*/
    #define FACTORYRESET_ENABLE         0
    #define MINIMUM_FIRMWARE_VERSION    "0.6.6"
    #define MODE_LED_BEHAVIOUR          "MODE"
/*=========================================================================*/

// Create the bluefruit object, either software serial...uncomment these lines
/* ...or hardware serial, which does not need the RTS/CTS pins. Uncomment this line */
Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);
void readPacket(Adafruit_BLE *ble, int timeout);

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
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
//  while (!Serial);  // required for Flora & Micro
//  delay(500);

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

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ){
      Serial.println(F("Couldn't factory reset"));
    }
  }

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

/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{
  readPacket(&ble, BLE_READPACKET_TIMEOUT);
  if (cube.inUserMode()) 
  {
      // The last processed serial command was for a user
      // defined function, so run the action based on the
      // users input
      switch (action)
      {
        case 1:
          zigzag();
          break;
        case 2:
          randomPastels();
          break;
        case 3:
          randomColours();
          break;
        case 4:
          randomPrimaries();
          break;
        case 5:
          faceSweep();
          break;
      }
  }      
}

void zigzag()
{
  // Zig Zag style pattern
  // The Zig
  cube.all(BLACK);
  cube.set(0,0,0, theColour);
  cube.set(2,0,0, theColour);
  cube.set(1,1,0, theColour);
  cube.set(3,1,0, theColour);
  cube.set(0,2,0, theColour);
  cube.set(2,2,0, theColour);
  cube.set(1,3,0, theColour);
  cube.set(3,3,0, theColour);
  cube.copyplane(Z, 0, 2);    
  cube.set(1,0,1, theColour);
  cube.set(3,0,1, theColour);
  cube.set(0,1,1, theColour);
  cube.set(2,1,1, theColour);
  cube.set(1,2,1, theColour);
  cube.set(3,2,1, theColour);
  cube.set(0,3,1, theColour);
  cube.set(2,3,1, theColour);
  cube.copyplane(Z, 1, 3);  
  delay(300);

  // The Zag
  cube.all(BLACK);
  cube.set(1,0,0, theColour);
  cube.set(3,0,0, theColour);
  cube.set(0,1,0, theColour);
  cube.set(2,1,0, theColour);
  cube.set(1,2,0, theColour);
  cube.set(3,2,0, theColour);
  cube.set(0,3,0, theColour);
  cube.set(2,3,0, theColour);
  cube.copyplane(Z, 0, 2);    
  cube.set(0,0,1, theColour);
  cube.set(2,0,1, theColour);
  cube.set(1,1,1, theColour);
  cube.set(3,1,1, theColour);
  cube.set(0,2,1, theColour);
  cube.set(2,2,1, theColour);
  cube.set(1,3,1, theColour);
  cube.set(3,3,1, theColour);
  cube.copyplane(Z, 1, 3);   
  delay(300);
}

void randomPastels()
{
  // Function by Jonathan Oxer (jon@freetronics.com), from 
  // the RandomPastels example sketch
  cube.set(random(4), random(4), random(4), RGB(random(255), random(255), random(255)));
  delay(2);
}

void randomColours()
{
  // Function by Jonathan Oxer (jon@freetronics.com), from 
  // the RandomColours example sketch
  byte xPos;
  byte yPos;
  byte zPos;
  byte rr;
  byte gg;
  byte bb;

  xPos = random(4);
  yPos = random(4);
  zPos = random(4);
  rr = random(0, 2) * 255;
  gg = random(0, 2) * 255;
  bb = random(0, 2) * 255;


  cube.set(xPos, yPos, zPos, RGB(rr, gg, bb));
  delay(2);
}

void randomPrimaries()
{
  // Function by Jonathan Oxer (jon@freetronics.com), from 
  // the RandomPrimaries example sketch
  rgb_t colours[3] = {RED, GREEN, BLUE};
  byte xPos;
  byte yPos;
  byte zPos;

  xPos = random(0, 4);
  yPos = random(0, 4);
  zPos = random(0, 4);
  byte i = random(0, 3);

  cube.set(xPos, yPos, zPos, colours[i]);
  delay(2);
}

void faceSweep() 
{
  cube.all(BLACK);
  // Move 1
  cube.setplane(Y, 0, BLUE);
  delay(100);

  // Move 2
  cube.set(0,0,0, BLACK);
  cube.set(1,0,0, BLACK);
  cube.set(2,0,0, BLACK);
  cube.set(3,0,0, BLACK);
  cube.set(0,1,0, BLUE);
  cube.set(1,1,0, BLUE);
  cube.set(2,1,0, BLUE);
  cube.set(3,1,0, BLUE);
  delay(100);

  // Move 3
  cube.set(0,1,0, BLACK);
  cube.set(1,1,0, BLACK);
  cube.set(2,1,0, BLACK);
  cube.set(3,1,0, BLACK);
  cube.set(0,0,1, BLACK);
  cube.set(1,0,1, BLACK);
  cube.set(2,0,1, BLACK);
  cube.set(3,0,1, BLACK);
  cube.set(0,2,0, BLUE);
  cube.set(1,2,0, BLUE);
  cube.set(2,2,0, BLUE);
  cube.set(3,2,0, BLUE);
  cube.set(0,1,1, BLUE);
  cube.set(1,1,1, BLUE);
  cube.set(2,1,1, BLUE);
  cube.set(3,1,1, BLUE);
  delay(100);

  // Move 4
  cube.set(0,2,0, BLACK);
  cube.set(1,2,0, BLACK);
  cube.set(2,2,0, BLACK);
  cube.set(3,2,0, BLACK);
  cube.set(0,1,1, BLACK);
  cube.set(1,1,1, BLACK);
  cube.set(2,1,1, BLACK);
  cube.set(3,1,1, BLACK);
  cube.set(0,0,2, BLACK);
  cube.set(1,0,2, BLACK);
  cube.set(2,0,2, BLACK);
  cube.set(3,0,2, BLACK);
  cube.set(0,3,0, BLUE);
  cube.set(1,3,0, BLUE);
  cube.set(2,3,0, BLUE);
  cube.set(3,3,0, BLUE);
  cube.set(0,2,1, BLUE);
  cube.set(1,2,1, BLUE);
  cube.set(2,2,1, BLUE);
  cube.set(3,2,1, BLUE);
  cube.set(0,1,2, BLUE);
  cube.set(1,1,2, BLUE);
  cube.set(2,1,2, BLUE);
  cube.set(3,1,2, BLUE);
  delay(100);

  // Move 5
  cube.set(0,3,0, BLACK);
  cube.set(1,3,0, BLACK);
  cube.set(2,3,0, BLACK);
  cube.set(3,3,0, BLACK);
  cube.set(0,2,1, BLACK);
  cube.set(1,2,1, BLACK);
  cube.set(2,2,1, BLACK);
  cube.set(3,2,1, BLACK);
  cube.set(0,1,2, BLACK);
  cube.set(1,1,2, BLACK);
  cube.set(2,1,2, BLACK);
  cube.set(3,1,2, BLACK);
  cube.set(0,1,3, BLUE); 
  cube.set(1,1,3, BLUE); 
  cube.set(2,1,3, BLUE); 
  cube.set(3,1,3, BLUE); 
  cube.set(0,2,2, BLUE);
  cube.set(1,2,2, BLUE);
  cube.set(2,2,2, BLUE);
  cube.set(3,2,2, BLUE);
  cube.set(0,3,1, BLUE);
  cube.set(1,3,1, BLUE);
  cube.set(2,3,1, BLUE);
  cube.set(3,3,1, BLUE);
  delay(100);

  // Move 6 
  cube.set(0,2,2, BLACK);
  cube.set(1,2,2, BLACK);
  cube.set(2,2,2, BLACK);
  cube.set(3,2,2, BLACK);
  cube.set(0,3,1, BLACK);
  cube.set(1,3,1, BLACK);
  cube.set(2,3,1, BLACK);
  cube.set(3,3,1, BLACK);
  cube.set(0,2,3, BLUE);
  cube.set(1,2,3, BLUE);
  cube.set(2,2,3, BLUE);
  cube.set(3,2,3, BLUE);
  cube.set(0,3,2, BLUE);
  cube.set(1,3,2, BLUE);
  cube.set(2,3,2, BLUE);
  cube.set(3,3,2, BLUE);
  delay(100);

  // Move 7
  cube.set(0,3,2, BLACK);
  cube.set(1,3,2, BLACK);
  cube.set(2,3,2, BLACK);
  cube.set(3,3,2, BLACK);
  cube.set(0,3,3, BLUE);
  cube.set(1,3,3, BLUE);
  cube.set(2,3,3, BLUE);
  cube.set(3,3,3, BLUE);
 
  delay(500);
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

