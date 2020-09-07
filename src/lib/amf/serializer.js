import BaseSerializer from './base.js';
import { AMF3_UNDEFINED, AMF3_NULL, AMF3_FALSE, AMF3_TRUE, AMF3_INT, AMF3_DOUBLE, AMF3_STRING, AMF3_DATE, AMF3_ARRAY, AMF3_OBJECT, AMF3_BYTE_ARRAY, MIN_INT, MAX_INT, MIN_2_BYTE_INT, MIN_3_BYTE_INT, MIN_4_BYTE_INT, isDenseArray, REFERENCE_BIT } from './spec.js';
import ReferenceStore from '../util/reference-store.js';
import { isSerializable, getObjectKeys, getClassName } from '../util/object.js';
import ByteArray from '../type/bytearray.js';
import utf8 from 'utf8';
import SerializationException from '../exception/serialization.js';

const { encode } = utf8;

export default class Serializer extends BaseSerializer{
  constructor(stream, options) {
    super(stream);
    
    this.options = options;
  }
  serialize (data, includeType, forceType) {
    if (typeof includeType == 'undefined')
      includeType = true;

    var type = forceType ? forceType : this.getDataType(data);

    // add the AMF type marker for this data before the serialized data is added
    if (includeType) {
      this.stream.writeByte(type);
    }

    switch (type) {
      case AMF3_UNDEFINED:
      case AMF3_NULL:
      case AMF3_FALSE:
      case AMF3_TRUE:
        // no data is serialized except their type marker
        break;

      case AMF3_INT:
        this.serializeInt(data);

        break;

      case AMF3_DOUBLE:
        this.serializeDouble(data);
        break;

      case AMF3_STRING:
        this.serializeString(data);
        break;

      case AMF3_DATE:
        this.serializeDate(data);
        break;

      case AMF3_ARRAY:
        this.serializeArray(data);
        break;

      case AMF3_OBJECT:
        this.serializeObject(data);
        break;

      case AMF3_BYTE_ARRAY:
        this.serializeByteArray(data);
        break;

      default:
        throw new SerializationException('Unrecognized AMF type [' + type + ']');
    }

    return this.stream.getRaw();
  }
  serializeInt (data) {
    if (data < MIN_INT || data > MAX_INT) {
      throw new SerializationException('Integer out of range: ' + data);
    }

    data &= 0x1FFFFFFF;

    if (data < MIN_2_BYTE_INT) {
      this.stream.writeByte(data);
    }
    else if (data < MIN_3_BYTE_INT) {
      this.stream.writeByte(data >> 7 & 0x7F | 0x80);
      this.stream.writeByte(data & 0x7F);
    }
    else if (data < MIN_4_BYTE_INT) {
      this.stream.writeByte(data >> 14 & 0x7F | 0x80);
      this.stream.writeByte(data >> 7 & 0x7F | 0x80);
      this.stream.writeByte(data & 0x7F);
    }
    else {
      this.stream.writeByte(data >> 22 & 0x7F | 0x80);
      this.stream.writeByte(data >> 15 & 0x7F | 0x80);
      this.stream.writeByte(data >> 8 & 0x7F | 0x80);
      this.stream.writeByte(data & 0xFF);
    }
  }
  serializeDouble (data) {
    this.stream.writeDouble(data);
  }
  serializeString (data, useRefs) {
    useRefs = typeof useRefs == 'undefined' ? true : useRefs;

    if (useRefs) {
      var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_STRING);
      if (ref !== false) {
        //use reference
        this.serializeInt(ref << 1);
        return;
      }
    }

    var encoded = encode(data);
    this.serializeInt((encoded.length << 1) | 1);
    this.stream.writeRaw(encoded);
  }
  serializeDate (data) {
    var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
    if (ref !== false) {
      //use reference
      this.serializeInt(ref << 1);
      return;
    }

    this.serialize(data.getTime(), true, AMF3_DOUBLE);
  }
  serializeArray (data) {
    var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
    if (ref !== false) {
      //use reference
      this.serializeInt(ref << 1);
      return;
    }

    var element = null;
    var isDense = isDenseArray(data);
    if (isDense) {
      this.serializeInt((data.length << 1) | REFERENCE_BIT);
      this.serializeString('');

      for (var i in data) {
        element = data[i];
        this.serialize(element);
      }

    }
    else {
      this.serializeInt(1);

      for (var key in data) {
        element = data[key];
        this.serializeString(key, false);
        this.serialize(element);
      }

      this.serializeString('');
    }
  }
  serializeObject (data) {

    var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
    if (ref !== false) {
      //use reference
      this.serializeInt(ref << 1);
      return;
    }

    // maintain a reference to the initial object
    var object = data;

    // if object is serializable, export its data first
    if (isSerializable(data)) {
      data = data.exportData();
    }

    var properties = getObjectKeys(data);

    // write object info & class name
    this.serializeInt(11);
    this.serializeString(getClassName(object, this.options), false);

    // write keys
    if (properties.length > 0) {
      for (var i in properties) {
        var key = properties[i];
        var value = data[key];
        this.serializeString(key, false);
        this.serialize(value);
      }
    }

    // close
    this.serializeString('');
  }
  serializeByteArray (data) {
    if (!('getData' in data)) {
      throw new SerializationException('Invalid ByteArray data provided');
    }

    var ref = this.referenceStore.getReference(data, ReferenceStore.TYPE_OBJECT);
    if (ref !== false) {
      //use reference
      this.serializeInt(ref << 1);
      return;
    }

    // write length
    this.serializeInt((data.getData().length << 1) | REFERENCE_BIT);

    // write raw bytes
    this.stream.writeRaw(data.getData());
  }
}
