import Stream from './stream.js';
import { pack } from '../util/ieee754.js';

function toAscii(bytes) {
  var ascii = '';
  for(var i in bytes) {
    var byte = bytes[i];
    ascii += String.fromCharCode(parseInt(byte));
  }

  return ascii;
};

export default class OutputStream extends Stream {
  constructor(raw?: any) {
    // call super
    super(raw);
  }
  /**
   * Write a single byte as a signed char
   */
  writeByte (byte) {
    this.raw += String.fromCharCode(byte);
  }
  /**
   * Write a stream of bytes as signed chars
   */
  writeDouble (double) {
    this.raw += toAscii(pack(double)); // in pack , 11, 52
  }
  /**
   * Write raw bytes
   */
  writeRaw (raw) {
    this.raw += raw;
  }
}