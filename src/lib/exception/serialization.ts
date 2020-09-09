import Exception from './base.js';

export default class SerializationException extends Exception {
  constructor(message) {
    super(message,  'SerializationException')
  }
}