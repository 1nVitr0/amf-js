export default class ByteArray {
  protected data: any;

  constructor(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setData(data: any) {
    this.data = data;
  }

  toString() {
    return this.getData();
  }
}