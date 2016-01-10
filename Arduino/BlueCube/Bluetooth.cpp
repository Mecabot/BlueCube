/*
 * Bluetooth.cpp - Bluetooth functionality for Freetronics 4x4x4 Cube
 */

#include "Arduino.h"
#include "Cube.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Bluetooth.h"

Bluetooth::Bluetooth(Adafruit_BLE *ble, int timeout)
{
  _ble = ble;
  _timeout = timeout;
  _previousMillis = 0;

  _prepareForCommand();
}

void Bluetooth::_prepareForCommand()
{
  // Reset the packet buffer
  memset(_packetBuffer, 0, READ_BUFSIZE + 1);   // Fill buffer with zeros
  _bufferIndex = 0;                             // Current pos within the received char buffer
  _timeRemaining = _timeout;
}

void Bluetooth::checkForCommand()
{
  if (_timeRemaining >= 0) {
    // Loop whilever we haven't reached the timeout

    if (_bufferIndex >= READ_BUFSIZE) {
      // Exit the loop if the buffer we have allocated is full
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
        serial->print(c);

        // Reset the timeout counter to our original timeout value
        _timeRemaining = _timeout;

        // Look for the character we use to indicate the end of a message
        if (c == ';') {
          // We have reached the end of the message, so print a new line
          serial->println();

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
    _packetBuffer[_bufferIndex] = 0;  // null term

    if (!_bufferIndex) {
      _prepareForCommand();
      return;               // no data or we hit the timeout, so exit the function
    }

    // We have data, so pass it to the cube's parser to read the message and act upon it
    bytecode_t bytecode = {};
    byte errorCode = parser(_packetBuffer, sizeof(_packetBuffer), & bytecode);
    _prepareForCommand();
  }
}

