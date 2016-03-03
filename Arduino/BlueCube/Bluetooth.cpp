/*
 *  File:     Bluetooth.cpp         
 *  Purpose:  Non blocking bluetooth functionality for Freetronics 4x4x4 Cube
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 *
 *  Notes:    This code was based on the nRF51822 based Bluefruit LE modules
 *            example code provided by Adafruit, particularly the
 *            packetParser() function.
 */

// Include for Arduino Library
#include "Arduino.h"

// Include for Cube Library
#include "Cube.h"

// Include for Bluetooth Hardware
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"

// Include the header file for this class
#include "Bluetooth.h"

Bluetooth::Bluetooth(Adafruit_BLE *ble, int timeout)
{
  // Retain a pointer to the BLE object for use within this class
  _ble = ble;

  // Retain the timeout to use
  _timeout = timeout;

  // Call the prepare function to set other defaults
  _prepareForCommand();
}

void Bluetooth::_prepareForCommand()
{
  // Called once at the start of each attempt to read a command

  // Reset the packet buffer
  memset(_packetBuffer, 0, READ_BUFSIZE + 1);   // Fill buffer with zeros
  _bufferIndex = 0;                             // Reset current position within the
  // received character buffer
  // Reset the time remaining before timeout
  _timeRemaining = _timeout;
}

void Bluetooth::checkForCommand()
{
  if (_timeRemaining >= 0) {
    // Process code while we haven't reached the timeout

    if (_bufferIndex >= READ_BUFSIZE) {
      // If the buffer we have allocated is full, stop the time remaining countdown
      _timeRemaining = 0;
    } else {

      while (_ble->available()) {
        // Loop while there are characters available to read from the bluetooth connection

        // Get the next available character
        char c = _ble->read();

        // Add it to our buffer, and increment the index
        _packetBuffer[_bufferIndex] = c;
        _bufferIndex++;

        // Print the character we have received to the USB serial output
        //serial->print(c);

        // Reset the timeout counter to our original timeout value
        _timeRemaining = _timeout;

        // Look for the character we use to indicate the end of a message
        if (c == ';') {
          // We have reached the end of the message, so print a new line
          //serial->println();

          // Set the timeout to zero as we don't need to wait any longer for characters
          _timeRemaining = 0;

          // Break out of the inner characters available loop
          break;
        }
      }
    }
  }

  if (_timeRemaining == 0 )
  {
    if (!_bufferIndex) {
      // no data or we hit the timeout

      // Reset the buffer
      _prepareForCommand();

      // exit the function
      return;
    }

    // We have data, so pass it to the cube's parser to read the message and act upon it

    // Null terminate the packet buffer
    _packetBuffer[_bufferIndex] = 0;

    // Call the cube libraries parser to action the message
    bytecode_t bytecode = {};
    byte errorCode = parser(_packetBuffer, sizeof(_packetBuffer), & bytecode);

    // Reset the buffer
    _prepareForCommand();
  }
}

