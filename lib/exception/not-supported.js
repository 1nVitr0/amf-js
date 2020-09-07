import Exception from './base.js';

export default class NotSupportedException extends Exception {
  constructor(message) {
    super(message,  'NotSupportedException')
  }
}