import indexOf from './indexof.js';

export default class ReferenceStore {
  protected store: object;

  static TYPE_STRING = 'string';
  static TYPE_OBJECT = 'object';

  constructor() {
    this.store = {};
    this.store[ReferenceStore.TYPE_STRING] = [];
    this.store[ReferenceStore.TYPE_OBJECT] = [];
  }

  /**
 * Creates or retrieves an object reference from the store
 *
 * @param data
 * @param type
 * @returns {*}
 */
  getReference (data, type) {
    var index = indexOf(this.store[type], data);
    if (index >= 0) {
      return index;
    }

    if (!this.validate(data)) {
      return false;
    }

    this.addReference(data, type);
    return false;
  }

  /**
   * Retrieves a value of a given type by reference
   *
   * @param reference
   * @param type
   * @returns {*}
   */
  getByReference (reference, type) {
    if (!this.store.hasOwnProperty(type)) {
      return false;
    }

    var count = this.store[type].length;

    if (reference >= count) {
      return false;
    }

    if (!count) {
      return false;
    }

    return this.store[type][reference];
  }

  /**
   * Validates a given value and type for issues
   * and prepares array for possible reference addition
   *
   * @param data
   * @returns {boolean}
   */
  validate (data) {
    // null or zero-length values cannot be assigned references
    if (data === null || (typeof data == 'string' && !data.length)) {
      return false;
    }

    return true;
  }

  /**
   * Adds a new reference by type
   *
   * @param data
   * @param type
   * @returns {*}
   */
  addReference (data, type) {
    if (!this.validate(data)) {
      return false;
    }

    this.store[type].push(data);
    return data;
  }
}