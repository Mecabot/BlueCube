/*
 * Bluetooth.h - Bluetooth functionality for Freetronics 4x4x4 Cube
 */
#ifndef Bluetooth_h
#define Bluetooth_h

#include "Arduino.h"
#include "Cube.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"

class Bluetooth {
  public:
    Bluetooth(Adafruit_BLE *ble, int timeout);
    void checkForCommand(); 

  private:
    Adafruit_BLE *_ble;
    int _timeout;
    int _timeRemaining;
    char _packetBuffer[READ_BUFSIZE + 1];
    int _bufferIndex;
    unsigned long _previousMillis;

    void _prepareForCommand();
};

#endif

