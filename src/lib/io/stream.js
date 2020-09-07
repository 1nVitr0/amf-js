export default class Stream {
  constructor(raw) {
    if (!raw || typeof raw == 'undefined') {
      raw = '';
    }

    this.raw = raw.toString();
  }

  getRaw() {
    return this.raw;
  }

  toString() {
    return this.getRaw();
  }
}