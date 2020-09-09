export default class Stream {
  protected raw: string;

  constructor(raw?: any) {
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