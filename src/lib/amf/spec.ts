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
export const AMF3_OBJECT = 0x0a;
export const AMF3_XML = 0x0b;
export const AMF3_BYTE_ARRAY = 0x0c;
export const AMF3_VECTOR_INT = 0x0d;
export const AMF3_VECTOR_UINT = 0x0e;
export const AMF3_VECTOR_DOUBLE = 0x0f;
export const AMF3_VECTOR_OBJECT = 0x10;
export const AMF3_DICTIONARY = 0x11;
export const OBJECT_DYNAMIC = 0x00;
export const REFERENCE_BIT = 0x01;
export const MIN_2_BYTE_INT = 0x80;
export const MIN_3_BYTE_INT = 0x4000;
export const MIN_4_BYTE_INT = 0x200000;
export const MAX_INT = 0xfffffff;
export const MIN_INT = -0x10000000;

export type AmfDatatype =
  | typeof AMF3_UNDEFINED
  | typeof AMF3_NULL
  | typeof AMF3_FALSE
  | typeof AMF3_TRUE
  | typeof AMF3_INT
  | typeof AMF3_DOUBLE
  | typeof AMF3_STRING
  | typeof AMF3_XML_DOC
  | typeof AMF3_DATE
  | typeof AMF3_ARRAY
  | typeof AMF3_OBJECT
  | typeof AMF3_XML
  | typeof AMF3_BYTE_ARRAY
  | typeof AMF3_VECTOR_INT
  | typeof AMF3_VECTOR_UINT
  | typeof AMF3_VECTOR_DOUBLE
  | typeof AMF3_VECTOR_OBJECT
  | typeof AMF3_DICTIONARY
  | typeof OBJECT_DYNAMIC
  | typeof REFERENCE_BIT
  | typeof MIN_2_BYTE_INT
  | typeof MIN_3_BYTE_INT
  | typeof MIN_4_BYTE_INT
  | typeof MAX_INT
  | typeof MIN_INT;

export function isLittleEndian() {
  return true;
}
export function isDenseArray(array: any[]) {
  if (!array) {
    return true;
  }

  let test = 0;
  for (const x in array) {
    const index = typeof x == 'number' ? x : parseInt(x);
    if (index != test) return false;

    test++;
  }

  return true;
}
