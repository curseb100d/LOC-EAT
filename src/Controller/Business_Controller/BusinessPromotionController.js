import BusinessPromotionModel from "../../Model/Business_Model/BusinessPromotionModel";

class BusinessPromotionController {
  calculatePromotion(
    foodDiscountDescription, discount, storeName, location, startDate, endDate
  ) {
    const promotionDetails = BusinessPromotionModel.calculatePromotion(
      foodDiscountDescription, discount, storeName, location, startDate, endDate
    );

    return promotionDetails;
  }
}

export default new BusinessPromotionController();
