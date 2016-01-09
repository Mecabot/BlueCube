/*
 * ZigZag.h - ZigZag Patter for the Freetronics 4x4x4 Cube
 */
#ifndef ZigZag_h
#define ZigZag_h

#include "Arduino.h"
#include "Cube.h"

class ZigZag {
  public:
    ZigZag(int theDelay, Cube cube);
    void Update(rgb_t theColour); 

  private:
    int _theDelay;
    Cube _cube;
    int _state;
    unsigned long _previousMillis;
};

#endif

