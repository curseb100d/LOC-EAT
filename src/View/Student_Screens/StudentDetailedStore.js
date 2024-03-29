import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';
import axios from 'axios';

const StudentDetailedStore = ({ route }) => {
  const { storeData } = route.params;
  const [promoObj, setPromoObj] = useState({});
  const [foodmenus, setFoodMenu] = useState([]);
  const navigation = useNavigation();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [images, setImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = async (foodmenus) => {
    for (let food of foodmenus) {
      const listRef = ref1(storage, `food/${food.id}`);
      const imageList = await listAll(listRef);
      let downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
      if (downloadURLs.length > 0) {
        downloadURLs = downloadURLs.pop();
        setImages((prevImages) => ({
          ...prevImages,
          [food.id]: downloadURLs,
        }));
        setIsLoading(true);
      }
    }
  }

  // Fetch products from the database
  useEffect(() => {
    const promoRef= ref(db, 'selectFoodPromotion');
    const cartRef = ref(db, 'foodcart');
    const foodmenuRef = ref(db, 'foodmenu');

    const unsubscribeFoodmenu = onValue(foodmenuRef, (snapshot) => {
      axios.get(promoRef+'.json')
      .then((response) => {
        if (response.data) {
          let promoDataObj = {};
          for (promo of response.data) {
            promoDataObj[promo.id] = promo;
            promoObj[promo.id] = promo;
          }
        }
      }).then(()=> {
        if (snapshot.exists()) {
          const foodmenusData = snapshot.val();
          const foodmenusArrayMapped = Object.keys(foodmenusData).map((id) => {
            if ( storeData.storeName === foodmenusData[id].storeName){
              tempFoodMenu = {
                id,
                ...foodmenusData[id],
                quantity: 0,
                totalPrice: 0,
              }
            
              if (id in promoObj) {
                tempFoodMenu['price'] = promoObj[id].discountedPrice;
              }
              return tempFoodMenu; 
            } else {
              return undefined;
            }
          });
          const foodmenusArray = foodmenusArrayMapped.filter((item) => {return (item) ? true : false});
          setFoodMenu(foodmenusArray);
          fetchImages(foodmenusArray);
        }
      });
    });
    
    const unsubscribeCart = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        setCart(cartData || []);  
      }
    });
    
    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribeCart();
      unsubscribeFoodmenu();
    };
  }, []);

  const addToCart = (foodName, quantity) => {
    const updatedCart = [...cart];
    const foodmenuIndex = updatedCart.findIndex((item) => item.id === foodName.id);
    
    if (foodmenuIndex !== -1) {
      updatedCart[foodmenuIndex].quantity += quantity;
      if (updatedCart[foodmenuIndex].quantity <= 0) {
        // If quantity reaches 0, remove the item from the cart
        updatedCart.splice(foodmenuIndex, 1);
      } else {
        updatedCart[foodmenuIndex].totalPrice =
        updatedCart[foodmenuIndex].price * updatedCart[foodmenuIndex].quantity;
      }
    } else if (quantity > 0) {
      updatedCart.push({ ...foodName, quantity, totalPrice: foodName.price * quantity });
    }
    
    setCart(updatedCart);
    
    // Update the cart data in Realtime Firebase
    const cartRef = ref(db, 'foodcart');
    set(cartRef, updatedCart);
    
    // Calculate the total quantity from the updatedCart and set it to the item.quantity
    const updatedFoodMenus = [...foodmenus];
    updatedFoodMenus.forEach((item) => {
      const cartItem = updatedCart.find((cartItem) => cartItem.id === item.id);
      item.quantity = cartItem ? cartItem.quantity : 0;
    });
    
    setFoodMenu(updatedFoodMenus);
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };
  
  const calculateTotalQuantity = () => {
    return cart.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  };
  
  const navigateToReviewScreen = () => {
    // Here, you can implement the logic to send the cart data to the 'reviewedorder' in Firebase
    // and then navigate to the review screen with the cart data.
    navigation.navigate('StudentReviewScreen', { storeData });
  };
  
  const navigateToCartScreen = () => {
    // Here, you can implement the logic to send the cart data to the 'reviewedorder' in Firebase
    // and then navigate to the review screen with the cart data.
    navigation.replace('StudentCartView');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Store Details</Text>
      <View style={styles.storeContainer}>
        <Text style={[styles.storeName, styles.centeredText]}>{storeData.storeName}</Text>
        <Text>{`Time Open: ${storeData.timeOpen}`}</Text>
        <Text>{`Location: ${storeData.location}`}</Text>
        <Text>{`Schedule: ${storeData.schedule}`}</Text>
        <TouchableOpacity style={styles.reviewButton} onPress={navigateToReviewScreen}>
          <Text style={styles.reviewButtonText}>View Reviews</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.menuHeading}>Store Menu</Text>

      <ScrollView>
        {foodmenus.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.circularCard}>
              {isLoading && (
                <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
              )}
            </View>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: ₱{item.price}</Text>
            <Text style={styles.itemLocation}>Store Name: {item.storeName}</Text>
            <Text style={styles.itemLocation}>Location: {item.location}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => addToCart(item, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => addToCart(item, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={navigateToCartScreen}>
          <Text style={styles.cartButtonText}>CART</Text>
        </TouchableOpacity>
        <Text style={styles.total}>{calculateTotalQuantity()}x Total Calculated: P{calculateTotal()}</Text>
      </View>
      {/* <TouchableOpacity style={styles.reviewButton} onPress={navigateToReviewScreen}>
      <Text style={styles.reviewButtonText}>View Reviews</Text>
    </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#800000',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  storeContainer: {
    backgroundColor: '#FFA500',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
  },
  menuItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemPrice: {
    fontSize: 16,
    color: 'maroon',
  },
  menuItemDescription: {
    fontSize: 14,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  adjustQuantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
  },
  reviewButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  cartButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 16,
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'right',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 30,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemPrice: {
    fontSize: 18,
    color: '#555',
    color: 'black',
  },
  itemLocation: {
    fontSize: 18,
    color: '#555',
    color: 'black',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});

export default StudentDetailedStore;
