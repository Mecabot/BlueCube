/*
 *  File:     FaceSweep.h - FaceSweep pattern for the Freetronics 4x4x4 Cube (non blocking)
 *  Version:  0.8
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 */

// Ensure that this header file is only processed once, regardless of how
// many time it is included
#ifndef FaceSweep_h
#define FaceSweep_h

// Include for Arduino Library
#include "Arduino.h"

// Include for Cube Library
#include "Cube.h"

// Declare out class, with public and private variables and functions
class FaceSweep {
  public:
    // Constructor method, requiring the cube class, the time in
    // milliseconds between animations, and the colour to use.
    FaceSweep(Cube cube, int theDelay, rgb_t theColour = BLUE);

    // Function to determine what the current state of the annimation
    // should be, and to update the cube to that state if appropriate.
    void update();

  private:
    // Reference to the cube
    Cube _cube;

    // Delay between animation states in milliseconds
    int _theDelay;

    // Colour to use
    rgb_t _theColour;

    // The state the animation is in
    int _state;

    // Tracks the time the code was last run
    unsigned long _previousMillis;
};

#endif

