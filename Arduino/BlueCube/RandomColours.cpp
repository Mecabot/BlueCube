/*
 * RandomColours.cpp - Randomly lightup all of the LEDs on a Freetronix 4x4x4 cube
 */

#include "Arduino.h"
#include "Cube.h"
#include "RandomColours.h"

RandomColours::RandomColours(Cube cube, int theDelay)
{
  _theDelay = theDelay;
  _cube = cube;

  _previousMillis = 0;

  randomSeed(analogRead(0));
}

void RandomColours::pastels() {
  // check to see if it's time to change the state of the LED
  unsigned long currentMillis = millis();
  if (currentMillis - _previousMillis >= _theDelay) 
  {
    _cube.set(random(4), random(4), random(4), RGB(random(255), random(255), random(255)));
    _previousMillis = currentMillis;   // Remember the time
  }
}

void RandomColours::allColours() {
  // check to see if it's time to change the state of the LED
  unsigned long currentMillis = millis();
  if (currentMillis - _previousMillis >= _theDelay) 
  {
    byte rr = random(0, 2) * 255;
    byte gg = random(0, 2) * 255;
    byte bb = random(0, 2) * 255;
  
    _cube.set(random(4), random(4), random(4), RGB(rr, gg, bb));
    _previousMillis = currentMillis;   // Remember the time
  }
}

void RandomColours::primary()
{
  // check to see if it's time to change the state of the LED
  unsigned long currentMillis = millis();
  if (currentMillis - _previousMillis >= _theDelay) 
  {
    rgb_t colours[3] = {RED, GREEN, BLUE};
    byte i = random(0, 3);

    _cube.set(random(4), random(4), random(4), colours[i]);
    _previousMillis = currentMillis;   // Remember the time
  }
}

