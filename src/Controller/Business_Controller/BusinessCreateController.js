import BusinessHomeModel from "../../Model/Business_Model/BusinessCreateModel";

class BusinessCreateController {
  constructor() {
    this.foodItems = [];
  }

  getAllFoodItems() {
    return this.foodItems;
  }

  addFoodItem(name, price, type) {
    const id = new Date().getTime().toString();
    const foodItem = new BusinessHomeModel(id, name, price, type);
    this.foodItems.push(foodItem);
  }

  updateFoodItem(id, name, price, type) {
    const foodItem = this.foodItems.find((item) => item.id === id);
    if (foodItem) {
      foodItem.name = name;
      foodItem.price = price;
      foodItem.type = type;
    }
  }

  deleteFoodItem(id) {
    this.foodItems = this.foodItems.filter((item) => item.id !== id);
  }
}

export default new BusinessCreateController();
