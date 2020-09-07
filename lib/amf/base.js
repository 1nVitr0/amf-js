import { AMF3_UNDEFINED, AMF3_NULL, AMF3_TRUE, AMF3_FALSE, MIN_INT, MAX_INT, AMF3_DOUBLE, AMF3_INT, AMF3_STRING, AMF3_DATE, AMF3_BYTE_ARRAY, AMF3_ARRAY, AMF3_OBJECT } from './spec.js';
import ByteArray from '../type/bytearray.js';
import ReferenceStore from '../util/reference-store.js';
import NotSupportedException from '../exception/not-supported.js';

class BaseSerializer {
  constructor(stream) {
    this.stream = stream;
    this.referenceStore = new ReferenceStore();
  }

  getDataType(data) {
    switch(true) {
      case typeof data == 'undefined':
        return AMF3_UNDEFINED;

      case data === null:
        return AMF3_NULL;

      case data === true || data === false:
        return data ? AMF3_TRUE : AMF3_FALSE;

      case typeof data == 'number' && data % 1 === 0:
        // AMF3 uses "Variable Length Unsigned 29-bit Integer Encoding"
        // ...depending on the size, we will either deserialize it as an integer or a float

        if(data < MIN_INT || data > MAX_INT) {
          return AMF3_DOUBLE;
        }

        return AMF3_INT;

      case typeof data == 'number' && data % 1 !== 0:
        return AMF3_DOUBLE;

      case typeof data == 'string':
        return AMF3_STRING;

      case data instanceof Date:
        return AMF3_DATE;

      case data instanceof ByteArray:
        return AMF3_BYTE_ARRAY;

      case data instanceof Array:
        return AMF3_ARRAY;

      case typeof data == 'object':
        return AMF3_OBJECT;

      case typeof data == 'function':
        throw new NotSupportedException('Cannot serialize a function');

      default:
        return null;
    }
  }
}

export default BaseSerializer;
