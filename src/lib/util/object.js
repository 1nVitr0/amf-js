import * as AMF from '../amf/amf.js';

export function isSerializable(obj) {
  if(!obj) {
    return false;
  }

  return 'exportData' in obj && 'importData' in obj;
};

export function getClassName(obj, options) {
  if(typeof obj === 'object' && (AMF.CLASS_MAPPING_FIELD in obj)) {
    return (options & AMF.CLASS_MAPPING) ? obj._classMapping : '';
  }

  return '';
};

export function getObjectKeys(data) {
  if(!data) {
    return [];
  }

  const keys = [];
  for(const key in data) {
    if(key == AMF.CLASS_MAPPING_FIELD) {
      continue;
    }

    if(typeof data[key] == 'function') {
      continue;
    }

    keys.push(key);
  }

  return keys;
};