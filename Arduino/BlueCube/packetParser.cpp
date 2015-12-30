#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Cube.h"

//    READ_BUFSIZE            Size of the read buffer for incoming packets
#define READ_BUFSIZE                    (32)

/**************************************************************************/
/*!
    @brief  Waits for incoming data and parses it
*/
/**************************************************************************/
void readPacket(Adafruit_BLE *ble, int timeout) 
{
  int origtimeout = timeout, replyidx = 0;

  /* Buffer to hold incoming characters */
  char packetbuffer[READ_BUFSIZE+1];
  memset(packetbuffer, 0, READ_BUFSIZE);

  while (timeout--) {
    if (replyidx >= 32) break;
    while (ble->available()) {
      char c =  ble->read();
      packetbuffer[replyidx] = c;
      replyidx++;
      timeout = origtimeout;
      if (c == ';') {
        timeout = 0;
        break;
      }
    }
    
    if (timeout == 0) break;
    delay(1);
  }

  packetbuffer[replyidx] = 0;  // null term

  if (!replyidx)  // no data or timeout 
    return;    

  bytecode_t bytecode = {};
  byte errorCode = parser(packetbuffer, sizeof(packetbuffer), & bytecode);
}

