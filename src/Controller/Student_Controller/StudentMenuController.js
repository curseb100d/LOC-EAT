import StudentMenuModel from "../../Model/Student_Model/StudentMenuModel";

class StudentMenuController {
  constructor() {
    this.foodItems = [];
  }

  getAllFoodItems() {
    return this.foodItems;
  }

  addFoodItem(name, price, type) {
    const id = new Date().getTime().toString();
    const foodItem = new StudentMenuModel(id, name, price, type);
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

export default new StudentMenuController();
