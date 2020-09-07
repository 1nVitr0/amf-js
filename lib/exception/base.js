export default class Exception extends Error {
  constructor(message, name) {
    this.message = message;
    this.name = name;
  }
}