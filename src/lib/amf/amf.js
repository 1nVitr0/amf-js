import OutputStream from '../io/output.js';
import InputStream from '../io/input.js';
import Serializer from './serializer.js';
import Deserializer from './deserializer.js';

export const CLASS_MAPPING = 0x01;
export const DEFAULT_OPTIONS = 0x00;
export const CLASS_MAPPING_FIELD = '_classMapping';

const classMappings = {};

/**
 * Serializes an object into an AMF packet
 *
 * @param data
 * @param includeType
 * @param forceType
 * @param options
 * @returns {*}
 */
export function serialize(data, includeType, forceType, options) {
  options = typeof options == 'undefined' ? DEFAULT_OPTIONS : options;

  const stream = new OutputStream();
  const serializer = new Serializer(stream, options);
  return serializer.serialize(data, includeType, forceType);
}

/**
 * Deserializes an AMF packet
 *
 * @param data
 * @param forceType
 * @returns {*}
 */
export function deserialize(data, forceType) {
  const stream = new InputStream(data);
  const deserializer = new Deserializer(stream);
  return deserializer.deserialize(forceType);
}

/**
 * Deserializes an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @returns {}
 */
export function parse(data)  {
  return deserialize(data);
}

/**
 * Serializes an object into an AMF packet
 * Convenience method to match JSON API
 *
 * @param data
 * @param options
 * @returns {}
 */
export function stringify(data, options)  {
  return serialize(data, true, undefined, options);
}

/**
 * Register a class alias for a particular name
 *
 * @param alias
 * @param obj
 */
export function registerClassAlias(alias, obj) {
  classMappings[alias] = obj;
}

/**
 * Return a class based on its related alias
 *
 * @param alias
 * @returns {*}
 */
export function getClassByAlias(alias) {
  if(!(alias in classMappings)) {
    return null;
  }

  return classMappings[alias];
}