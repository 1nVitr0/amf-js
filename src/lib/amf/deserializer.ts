import { getClassByAlias } from './amf.js';
import BaseSerializer from './base.js';
import { AMF3_UNDEFINED, AMF3_NULL, AMF3_FALSE, AMF3_TRUE, AMF3_INT, AMF3_DOUBLE, AMF3_STRING, AMF3_DATE, AMF3_ARRAY, AMF3_OBJECT, AMF3_BYTE_ARRAY, REFERENCE_BIT } from './spec.js';
import ReferenceStore from '../util/reference-store.js';
import ByteArray from '../type/bytearray.js';
import utf8 from 'utf8';
import DeserializationException from '../exception/deserialization.js';
import { Stream } from 'stream';
import InputStream from '../io/input';
import { ClassType } from './amf';

const { decode } = utf8;

export default class Deserializer extends BaseSerializer {
  protected stream: InputStream;

  constructor(stream: InputStream) {
    super(stream);
    this.stream = stream;
  }
  deserialize () {
    var type = this.stream.readByte();

    switch (parseInt(type)) {
      case AMF3_UNDEFINED:
        return undefined;

      case AMF3_NULL:
        return null;

      case AMF3_FALSE:
        return false;

      case AMF3_TRUE:
        return true;

      case AMF3_INT:
        return this.deserializeInt();

      case AMF3_DOUBLE:
        return this.deserializeDouble();

      case AMF3_STRING:
        return this.deserializeString();

      case AMF3_DATE:
        return this.deserializeDate();

      case AMF3_ARRAY:
        return this.deserializeArray();

      case AMF3_OBJECT:
        return this.deserializeObject();

      case AMF3_BYTE_ARRAY:
        return this.deserializeByteArray();

      default:
        throw new DeserializationException('Cannot deserialize type: ' + type);
    }
  }
  deserializeInt () {
    var result = 0;

    var n = 0;
    var b = this.stream.readByte();
    while ((+b & 0x80) !== 0 && n < 3) {
      result <<= 7;
      result |= (+b & 0x7F);
      b = this.stream.readByte();
      n++;
    }
    if (n < 3) {
      result <<= 7;
      result |= +b;
    }
    else {
      result <<= 8;
      result |= +b;
      if ((result & 0x10000000) !== 0) {
        result |= 0xE0000000;
      }
    }

    return result;
  }
  deserializeDouble () {
    return this.stream.readDouble();
  }
  deserializeString () {
    var reference = this.deserializeInt();

    if ((reference & REFERENCE_BIT) === 0) {
      reference >>= REFERENCE_BIT;

      return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_STRING);
    }

    var length = reference >> REFERENCE_BIT;
    var string = decode(this.stream.readRawBytes(length));
    this.referenceStore.addReference(string, ReferenceStore.TYPE_STRING);

    return string;
  }
  deserializeDate () {
    var reference = this.deserializeInt();

    if ((reference & REFERENCE_BIT) === 0) {
      reference >>= REFERENCE_BIT;

      return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
    }

    var millisSinceEpoch = this.stream.readDouble();
    var date = new Date(millisSinceEpoch);

    this.referenceStore.addReference(date, ReferenceStore.TYPE_OBJECT);

    return date;
  }
  deserializeArray () {
    var reference = this.deserializeInt();

    if ((reference & REFERENCE_BIT) === 0) {
      reference >>= REFERENCE_BIT;

      return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
    }

    var size = reference >> REFERENCE_BIT;

    var arr: any[] = [];
    this.referenceStore.addReference(arr, ReferenceStore.TYPE_OBJECT);

    var key = this.deserializeString();
    while (key.length > 0) {
      arr[key] = this.deserialize();
      key = this.deserializeString();
    }

    for (var i = 0; i < size; i++) {
      arr.push(this.deserialize());
    }

    return arr;
  }
  deserializeObject () {
    var reference = this.deserializeInt();

    if ((reference & REFERENCE_BIT) === 0) {
      reference >>= REFERENCE_BIT;

      return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
    }

    var classAlias = this.deserializeString();

    // need some kinda of callback function here to mix in the class' prototype to provide serializable functionality
    var instance: ClassType = {};

    // add a new reference at this stage - essential to handle self-referencing objects
    this.referenceStore.addReference(instance, ReferenceStore.TYPE_OBJECT);

    // collect all properties into hash
    var data = {};
    var property = this.deserializeString();

    while (property.length) {
      data[property] = this.deserialize();
      property = this.deserializeString();
    }

    // any custom classname will hint as serializability
    if (classAlias && classAlias.length > 0) {
      var classType = getClassByAlias(classAlias);

      if (!classType) {
        throw new DeserializationException('Class ' + classAlias + ' cannot be found. Consider registering a class alias.');
      }

      instance = new classType;
      if ('importData' in instance && typeof instance.importData == 'function') {
        instance.importData(data);
      }
      else {
        applyDataToInstance(instance, data);
      }
    }
    else {
      // assign all properties to class if property is public
      applyDataToInstance(instance, data);
    }

    return instance;
  }
  deserializeByteArray () {
    var reference = this.deserializeInt();

    if ((reference & REFERENCE_BIT) === 0) {
      reference >>= REFERENCE_BIT;

      return this.referenceStore.getByReference(reference, ReferenceStore.TYPE_OBJECT);
    }

    var length = reference >> REFERENCE_BIT;
    var bytes = this.stream.readRawBytes(length);

    return new ByteArray(bytes);

  }
}

var applyDataToInstance = function(instance: object, data: object) {
  
  for(var key in data) {
    try {
      var val = data[key];
      instance[key] = val;
    } catch(e) {
      throw new DeserializationException("Property '" + key + "' cannot be set on instance '" + (typeof instance) + "'");
    }
  }
};
