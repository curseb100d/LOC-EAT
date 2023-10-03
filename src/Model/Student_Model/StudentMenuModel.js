export default class BusinessCreateModel {
    constructor(id, name, price, type) {
      this.id = id;
      this._name = name;
      this._price = price;
      this._type = type;
    }
  
    get name() {
      return this._name;
    }
  
    set name(name) {
      this._name = name;
    }
  
    get price() {
      return this._price;
    }
  
    set price(price) {
      this._price = price;
    }
  
    get type() {
      return this._type;
    }
  
    set type(type) {
      this._type = type;
    }
  }
  