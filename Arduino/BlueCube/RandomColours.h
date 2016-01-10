/*
 * RandomColours.h - Randomly lightup all of the LEDs on a Freetronix 4x4x4 cube
 */
#ifndef RandomColours_h
#define RandomColours_h

#include "Arduino.h"
#include "Cube.h"

class RandomColours {
  public:
    RandomColours(Cube cube, int theDelay);
    void pastels();
    void allColours();
    void primary(); 

  private:
    int _theDelay;
    Cube _cube;
    unsigned long _previousMillis;
};

#endif

