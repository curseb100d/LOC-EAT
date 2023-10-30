class BusinessCreateModel {
  constructor() {
    this.discounts = [];
  }  

  calculateDiscount(foodName, foodDescription, price, discountPercentage, storeName, location) {
    const discountedPrice = price - (price * (discountPercentage / 100));
    return {foodName, foodDescription, price, percentage: discountPercentage, discountedPrice, storeName, location};
  }

  updateDiscount(index, updatedDiscount) {
    if (index >= 0 && index < this.discounts.length) {
      this.discounts[index] = updatedDiscount;
      return true; // Return true if update is successful
    }
    return false; // Return false if the index is out of bounds
  }
  
  deleteDiscount(index) {
    if (index >= 0 && index < this.discounts.length) {
      this.discounts.splice(index, 1);
      return true; // Return true if deletion is successful
    }
    return false; // Return false if the index is out of bounds
  }

  getAllDiscounts() {
    return this.discounts; // Return the array of discounts
  }  
}
export default new BusinessCreateModel();