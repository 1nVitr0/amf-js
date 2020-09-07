export default class ByteArray {
  constructor(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  toString() {
    return this.getData();
  }
}