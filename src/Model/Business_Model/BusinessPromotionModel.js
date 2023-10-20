class BusinessPromotionModel {
  calculateDiscount(price, discountPercentage, name, description, startDate, endDate) {
    //calculate discount
    const discountedPrice = price - (price * (discountPercentage / 100));
    
    //calculate start to end date
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = Math.abs(end - start);
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return { name, description, percentage: discountPercentage, discountedPrice, daysDifference };
  }
}
export default new BusinessPromotionModel();