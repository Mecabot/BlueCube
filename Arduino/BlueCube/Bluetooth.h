/*
 *  File:     Bluetooth.h - Non blocking bluetooth functionality
 *            for Freetronics 4x4x4 Cube
 *  Version:  0.8
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 */

// Ensure that this header file is only processed once, regardless of how
// many time it is included
#ifndef Bluetooth_h
#define Bluetooth_h

/*==========================================================================
    APPLICATION SETTINGS (USER EDITABLE)

    BLE_READPACKET_TIMEOUT    Timeout in ms waiting to read a message
    READ_BUFSIZE              Size of the read buffer for incoming packets
============================================================================ */
#define BLE_READPACKET_TIMEOUT         500
#define READ_BUFSIZE                   32
/*========================================================================== */

// Include for Arduino Library
#include "Arduino.h"

// Include for Cube Library
#include "Cube.h"

// Include for Bluetooth Hardware
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"

// Declare out class, with public and private variables
class Bluetooth {
  public:
    // Constructor method, requiring a pointer to the bluetooth object, and
    // the time in milliseconds to wait for a complete message
    Bluetooth(Adafruit_BLE *ble, int timeout);

    // Function for checking and processing any received messages
    void checkForCommand();

  private:
    // Bluetooth object
    Adafruit_BLE *_ble;

    // Maximum time to wait for a message to be received
    int _timeout;

    // Time remaining to wait for the message to be completely received
    int _timeRemaining;

    // Buffer that holds the recieved message, and the index for where
    // the next character should be inserted
    char _packetBuffer[READ_BUFSIZE + 1];
    int _bufferIndex;

    // Function to reset items between attempts to receive a message
    void _prepareForCommand();
};

#endif

