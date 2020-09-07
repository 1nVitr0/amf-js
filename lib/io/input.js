import Stream from './stream.js';
import { unpack } from '../util/ieee754.js';

function fromAscii(data) {
  var bytes = [];
  var reversed = data.split('');
  for(var i in reversed) {
    bytes.push(reversed[i].toString().charCodeAt(0));
  }

  return bytes;
};

export default class InputStream extends Stream {
  constructor(raw) {
    // call super
    super(raw);

    this.pointer = 0;
  }
  readByte () {
    return this.readBytes(1);
  }
  readRawByte () {
    return this.readBytes(1, true);
  }
  readRawBytes (length) {
    if (typeof length == 'undefined')
      length = 1;
    return this.readBytes(length, true);
  }
  readBytes (length, raw) {
    if (typeof length == 'undefined')
      length = 1;
    if (typeof raw == 'undefined')
      raw = false;

    value = this.getRaw().substr(this.pointer, length);
    this.pointer += value.length;

    if (raw) {
      return value;
    }

    var ordinal = '';
    for (var i = 0; i < value.length; i++) {
      ordinal += value.charCodeAt(i);
    }

    return ordinal;
  }
  /**
   * Read a byte as a float
   *
   * @return float
   */
  readDouble () {
    var double = this.readRawBytes(8);
    return unpack(fromAscii(double));
  }
}