export default class Exception extends Error {
  constructor(message, name) {
    super(message)
    this.name = name;
  }
}