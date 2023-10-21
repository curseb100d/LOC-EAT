class BusinessPromotionModel {
  calculateDiscount(foodName, foodDiscountDescription, originalPrice, discountPercentage, businessOwnerName, location) {
    const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
    return { foodName, foodDiscountDescription, percentage: discountPercentage, discountedPrice, businessOwnerName, location};
  }

  calculateDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = Math.abs(end - start);
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }  

}
export default new BusinessPromotionModel();