/*
 * ZigZag.cpp - ZigZag Patter for the Freetronics 4x4x4 Cube
 */

#include "Arduino.h"
#include "Cube.h"
#include "ZigZag.h"

ZigZag::ZigZag(Cube cube,int theDelay)
{
  _theDelay = theDelay;
  _cube = cube;

  _state = 0;
  _previousMillis = 0;
}

void ZigZag::update(rgb_t theColour)
{
  // check to see if it's time to change the state of the LED
  unsigned long currentMillis = millis();

  if ((_state == 1) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 0;  // Turn it off
    _previousMillis = currentMillis;  // Remember the time
    _cube.all(BLACK);
    _cube.set(1, 0, 0, theColour);
    _cube.set(3, 0, 0, theColour);
    _cube.set(0, 1, 0, theColour);
    _cube.set(2, 1, 0, theColour);
    _cube.set(1, 2, 0, theColour);
    _cube.set(3, 2, 0, theColour);
    _cube.set(0, 3, 0, theColour);
    _cube.set(2, 3, 0, theColour);
    _cube.copyplane(Z, 0, 2);
    _cube.set(0, 0, 1, theColour);
    _cube.set(2, 0, 1, theColour);
    _cube.set(1, 1, 1, theColour);
    _cube.set(3, 1, 1, theColour);
    _cube.set(0, 2, 1, theColour);
    _cube.set(2, 2, 1, theColour);
    _cube.set(1, 3, 1, theColour);
    _cube.set(3, 3, 1, theColour);
    _cube.copyplane(Z, 1, 3);
  }
  else if ((_state == 0) && (currentMillis - _previousMillis >= _theDelay))
  {
    _state = 1;  // turn it on
    _previousMillis = currentMillis;   // Remember the time
    _cube.all(BLACK);
    _cube.set(0, 0, 0, theColour);
    _cube.set(2, 0, 0, theColour);
    _cube.set(1, 1, 0, theColour);
    _cube.set(3, 1, 0, theColour);
    _cube.set(0, 2, 0, theColour);
    _cube.set(2, 2, 0, theColour);
    _cube.set(1, 3, 0, theColour);
    _cube.set(3, 3, 0, theColour);
    _cube.copyplane(Z, 0, 2);
    _cube.set(1, 0, 1, theColour);
    _cube.set(3, 0, 1, theColour);
    _cube.set(0, 1, 1, theColour);
    _cube.set(2, 1, 1, theColour);
    _cube.set(1, 2, 1, theColour);
    _cube.set(3, 2, 1, theColour);
    _cube.set(0, 3, 1, theColour);
    _cube.set(2, 3, 1, theColour);
    _cube.copyplane(Z, 1, 3);
  }
}

