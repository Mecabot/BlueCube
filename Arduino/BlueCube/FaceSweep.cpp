/*
 *  File:     FaceSweep.cpp - FaceSweep pattern for the Freetronics 4x4x4 Cube (non blocking)
 *  Version:  0.8
 *  Author:   Adam Reed (adam@secretcode.ninja)
 *  Licence:  BSD 3-Clause Licence
 */

// Include for Arduino Library
#include "Arduino.h"

// Include for Cube Library
#include "Cube.h"

// Include the header file for this class
#include "FaceSweep.h"

FaceSweep::FaceSweep(Cube cube, int theDelay, rgb_t theColour)
{
  // Retain the reference to the cube
  _cube = cube;

  // Retain the delay we will use
  _theDelay = theDelay;

  // Retain the colour to use
  _theColour = theColour;

  // Set the default initial state for the animation
  _state = 1;

  // Set the time we last ran the code to zero as it hasn't run yet
  _previousMillis = 0;
}

void FaceSweep::update()
{
  // Handles drawing the FaceSweep animation.

  /* This code is designed to be non blocking, so instead of using
   * "delay()", it uses a state machine to track where it is upto in the
   * animation. It then uses the time and the difference between this run
   * and the last run to determine if it needs to change to a different
   * state
   */

  // Get the current time
  unsigned long currentMillis = millis();

  if ((_state == 1) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 1 of the animation
    _cube.all(BLACK);
    _cube.setplane(Y, 0, _theColour);

    // Flag that we need to move to the next state
    _state = 2;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 2) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 2 of the animation
    _cube.line(0, 0, 0, 3, 0, 0, BLACK);
    _cube.line(0, 1, 0, 3, 1, 0, _theColour);

    // Flag that we need to move to the next state
    _state = 3;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 3) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 3 of the animation
    _cube.line(0, 1, 0, 3, 1, 0, BLACK);
    _cube.line(0, 0, 1, 3, 0, 1, BLACK);
    _cube.line(0, 2, 0, 3, 2, 0, _theColour);
    _cube.line(0, 1, 1, 3, 1, 1, _theColour);

    // Flag that we need to move to the next state
    _state = 4;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 4) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 4 of the animation
    _cube.line(0, 2, 0, 3, 2, 0, BLACK);
    _cube.line(0, 1, 1, 3, 1, 1, BLACK);
    _cube.line(0, 0, 2, 3, 0, 2, BLACK);
    _cube.line(0, 3, 0, 3, 3, 0, _theColour);
    _cube.line(0, 2, 1, 3, 2, 1, _theColour);
    _cube.line(0, 1, 2, 3, 1, 2, _theColour);

    // Flag that we need to move to the next state
    _state = 5;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 5) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 5 of the animation
    _cube.line(0, 3, 0, 3, 3, 0, BLACK);
    _cube.line(0, 2, 1, 3, 2, 1, BLACK);
    _cube.line(0, 1, 2, 3, 1, 2, BLACK);
    _cube.line(0, 1, 3, 3, 1, 3, _theColour);
    _cube.line(0, 2, 2, 3, 2, 2, _theColour);
    _cube.line(0, 3, 1, 3, 3, 1, _theColour);

    // Flag that we need to move to the next state
    _state = 6;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 6) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 6 of the animation
    _cube.line(0, 2, 2, 3, 2, 2, BLACK);
    _cube.line(0, 3, 1, 3, 3, 1, BLACK);
    _cube.line(0, 2, 3, 3, 2, 3, _theColour);
    _cube.line(0, 3, 2, 3, 3, 2, _theColour);

    // Flag that we need to move to the next state
    _state = 7;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 7) && (currentMillis - _previousMillis >= _theDelay))
  {
    // Draw frame 7 of the animation
    _cube.line(0, 3, 2, 3, 3, 2, BLACK);
    _cube.line(0, 3, 3, 3, 3, 3, _theColour);

    // Flag that we need to move to the next state
    _state = 8;
    // Remember the time for future reference
    _previousMillis = currentMillis;
  }
  else if ((_state == 8) && (currentMillis - _previousMillis >= _theDelay * 5))
  {
    // Draw frame 8 of the animation
    // - This is the end state for the animation, so we "pause" for longer than
    //   normal, then go back to the begining, remembering the time for future
    //   reference
    _state = 1;
    _previousMillis = currentMillis;
  }
}

