import BusinessCreateModel from "../../Model/Business_Model/BusinessCreateModel";

class BusinessCreateController {
  calculateDiscount(foodName, price, discountPercentage, storeName, location) {
    return BusinessCreateModel.calculateDiscount(foodName, price, discountPercentage, storeName, location);
  }

  updateDiscount(index, updatedDiscount) {
    return BusinessCreateModel.updateDiscount(index, updatedDiscount);
  }

  deleteDiscount(index) {
    return BusinessCreateModel.deleteDiscount(index);
  }

  getDiscounts() {
    return BusinessCreateModel.getAllDiscounts();
  }
}

export default new BusinessCreateController();
