import Exception from './base.js';

export default class DeserializationException extends Exception {
  constructor(message) {
    super(message,  'DeserializationException')
  }
}