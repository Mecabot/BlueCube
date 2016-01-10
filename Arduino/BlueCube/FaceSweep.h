/*
 * FaceSweep.h - Face Sweep pattern for the Freetronics 4x4x4 Cube
 */
#ifndef FaceSweep_h
#define FaceSweep_h

#include "Arduino.h"
#include "Cube.h"

class FaceSweep {
  public:
    FaceSweep(Cube cube,int theDelay, rgb_t theColour = BLUE);
    void update(); 

  private:
    int _theDelay;
    Cube _cube;
    rgb_t _theColour;
    int _state;
    unsigned long _previousMillis;
};

#endif

