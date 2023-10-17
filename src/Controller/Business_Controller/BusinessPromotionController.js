import BusinessPromotionModel from "../../Model/Business_Model/BusinessPromotionModel";

class BusinessPromotionController {
  calculateDiscount(price, discountPercentage, name, description, startDate, endDate) {
    return BusinessPromotionModel.calculateDiscount(price, discountPercentage, name, description, startDate, endDate);
  }
}

export default new BusinessPromotionController();