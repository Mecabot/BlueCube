/*
 * FaceSweep.cpp - FaceSweep pattern for the Freetronics 4x4x4 Cube
 */

#include "Arduino.h"
#include "Cube.h"
#include "FaceSweep.h"

FaceSweep::FaceSweep(Cube cube, int theDelay, rgb_t theColour)
{
  _theDelay = theDelay;
  _cube = cube;
  _theColour = theColour;

  _state = 1;
  _previousMillis = 0;
}

void FaceSweep::update()
{
  // check to see if it's time to change the state of the LED
  unsigned long currentMillis = millis();

  if ((_state == 1) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 2;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 1
    _cube.all(BLACK);
    _cube.setplane(Y, 0, _theColour);
  }
  else if ((_state == 2) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 3;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 2
    _cube.set(0, 0, 0, BLACK);
    _cube.set(1, 0, 0, BLACK);
    _cube.set(2, 0, 0, BLACK);
    _cube.set(3, 0, 0, BLACK);
    _cube.set(0, 1, 0, _theColour);
    _cube.set(1, 1, 0, _theColour);
    _cube.set(2, 1, 0, _theColour);
    _cube.set(3, 1, 0, _theColour);
  }
  else if ((_state == 3) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 4;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 3
    _cube.set(0, 1, 0, BLACK);
    _cube.set(1, 1, 0, BLACK);
    _cube.set(2, 1, 0, BLACK);
    _cube.set(3, 1, 0, BLACK);
    _cube.set(0, 0, 1, BLACK);
    _cube.set(1, 0, 1, BLACK);
    _cube.set(2, 0, 1, BLACK);
    _cube.set(3, 0, 1, BLACK);
    _cube.set(0, 2, 0, _theColour);
    _cube.set(1, 2, 0, _theColour);
    _cube.set(2, 2, 0, _theColour);
    _cube.set(3, 2, 0, _theColour);
    _cube.set(0, 1, 1, _theColour);
    _cube.set(1, 1, 1, _theColour);
    _cube.set(2, 1, 1, _theColour);
    _cube.set(3, 1, 1, _theColour);
  }
  else if ((_state == 4) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 5;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 4
    _cube.set(0, 2, 0, BLACK);
    _cube.set(1, 2, 0, BLACK);
    _cube.set(2, 2, 0, BLACK);
    _cube.set(3, 2, 0, BLACK);
    _cube.set(0, 1, 1, BLACK);
    _cube.set(1, 1, 1, BLACK);
    _cube.set(2, 1, 1, BLACK);
    _cube.set(3, 1, 1, BLACK);
    _cube.set(0, 0, 2, BLACK);
    _cube.set(1, 0, 2, BLACK);
    _cube.set(2, 0, 2, BLACK);
    _cube.set(3, 0, 2, BLACK);
    _cube.set(0, 3, 0, _theColour);
    _cube.set(1, 3, 0, _theColour);
    _cube.set(2, 3, 0, _theColour);
    _cube.set(3, 3, 0, _theColour);
    _cube.set(0, 2, 1, _theColour);
    _cube.set(1, 2, 1, _theColour);
    _cube.set(2, 2, 1, _theColour);
    _cube.set(3, 2, 1, _theColour);
    _cube.set(0, 1, 2, _theColour);
    _cube.set(1, 1, 2, _theColour);
    _cube.set(2, 1, 2, _theColour);
    _cube.set(3, 1, 2, _theColour);
  }
  else if ((_state == 5) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 6;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 5
    _cube.set(0, 3, 0, BLACK);
    _cube.set(1, 3, 0, BLACK);
    _cube.set(2, 3, 0, BLACK);
    _cube.set(3, 3, 0, BLACK);
    _cube.set(0, 2, 1, BLACK);
    _cube.set(1, 2, 1, BLACK);
    _cube.set(2, 2, 1, BLACK);
    _cube.set(3, 2, 1, BLACK);
    _cube.set(0, 1, 2, BLACK);
    _cube.set(1, 1, 2, BLACK);
    _cube.set(2, 1, 2, BLACK);
    _cube.set(3, 1, 2, BLACK);
    _cube.set(0, 1, 3, _theColour);
    _cube.set(1, 1, 3, _theColour);
    _cube.set(2, 1, 3, _theColour);
    _cube.set(3, 1, 3, _theColour);
    _cube.set(0, 2, 2, _theColour);
    _cube.set(1, 2, 2, _theColour);
    _cube.set(2, 2, 2, _theColour);
    _cube.set(3, 2, 2, _theColour);
    _cube.set(0, 3, 1, _theColour);
    _cube.set(1, 3, 1, _theColour);
    _cube.set(2, 3, 1, _theColour);
    _cube.set(3, 3, 1, _theColour);
  }
  else if ((_state == 6) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 7;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 6
    _cube.set(0, 2, 2, BLACK);
    _cube.set(1, 2, 2, BLACK);
    _cube.set(2, 2, 2, BLACK);
    _cube.set(3, 2, 2, BLACK);
    _cube.set(0, 3, 1, BLACK);
    _cube.set(1, 3, 1, BLACK);
    _cube.set(2, 3, 1, BLACK);
    _cube.set(3, 3, 1, BLACK);
    _cube.set(0, 2, 3, _theColour);
    _cube.set(1, 2, 3, _theColour);
    _cube.set(2, 2, 3, _theColour);
    _cube.set(3, 2, 3, _theColour);
    _cube.set(0, 3, 2, _theColour);
    _cube.set(1, 3, 2, _theColour);
    _cube.set(2, 3, 2, _theColour);
    _cube.set(3, 3, 2, _theColour);
  }
  else if ((_state == 7) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 8;  // Move to next state
    _previousMillis = currentMillis;  // Remember the time

    // Move 7
    _cube.set(0, 3, 2, BLACK);
    _cube.set(1, 3, 2, BLACK);
    _cube.set(2, 3, 2, BLACK);
    _cube.set(3, 3, 2, BLACK);
    _cube.set(0, 3, 3, _theColour);
    _cube.set(1, 3, 3, _theColour);
    _cube.set(2, 3, 3, _theColour);
    _cube.set(3, 3, 3, _theColour);
  }
  else if ((_state == 8) && (currentMillis - _previousMillis >= _theDelay * 5))
  {
    _state = 1;  // Move to start
    _previousMillis = currentMillis;  // Remember the time
  }
}

