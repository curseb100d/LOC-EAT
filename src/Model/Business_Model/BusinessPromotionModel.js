class BusinessPromotionModel {
  calculatePromotion(foodDiscountDescription, discount, storeName, location, startDate, endDate) {

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = Math.abs(end - start);
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return {
      foodDiscountDescription,
      discount,
      storeName,
      location,
      startDate,
      endDate,
      daysDifference
    };
  }
}

export default new BusinessPromotionModel();
