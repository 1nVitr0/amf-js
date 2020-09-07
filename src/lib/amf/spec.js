export const AMF3_UNDEFINED = 0x00;
export const AMF3_NULL = 0x01;
export const AMF3_FALSE = 0x02;
export const AMF3_TRUE = 0x03;
export const AMF3_INT = 0x04;
export const AMF3_DOUBLE = 0x05;
export const AMF3_STRING = 0x06;
export const AMF3_XML_DOC = 0x07;
export const AMF3_DATE = 0x08;
export const AMF3_ARRAY = 0x09;
export const AMF3_OBJECT = 0x0A;
export const AMF3_XML = 0x0B;
export const AMF3_BYTE_ARRAY = 0x0C;
export const AMF3_VECTOR_INT = 0x0D;
export const AMF3_VECTOR_UINT = 0x0E;
export const AMF3_VECTOR_DOUBLE = 0x0F;
export const AMF3_VECTOR_OBJECT = 0x10;
export const AMF3_DICTIONARY = 0x11;
export const OBJECT_DYNAMIC = 0x00;
export const REFERENCE_BIT = 0x01;
export const MIN_2_BYTE_INT = 0x80;
export const MIN_3_BYTE_INT = 0x4000;
export const MIN_4_BYTE_INT = 0x200000;
export const MAX_INT = 0xFFFFFFF;
export const MIN_INT = -0x10000000;
export function isLittleEndian () {
  return true;
}
export function isDenseArray (array) {
  if (!array) {
    return true;
  }

  var test = 0;
  for (var x in array) {

    if (x != test) {
      return false;
    }

    test++;
  }

  return true;
}