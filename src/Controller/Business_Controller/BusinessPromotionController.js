import BusinessPromotionModel from "../../Model/Business_Model/BusinessPromotionModel";

class BusinessPromotionController {
  calculateDiscount(foodName, foodDiscountDescription, originalPrice, discountPercentage, businessOwnerName, location) {
    return BusinessPromotionModel.calculateDiscount(foodName, foodDiscountDescription, originalPrice, discountPercentage, businessOwnerName, location);
  }

  calculateDaysDifference(startDate, endDate) {
    return BusinessPromotionModel.calculateDaysDifference(startDate, endDate);
  }
}

export default new BusinessPromotionController();