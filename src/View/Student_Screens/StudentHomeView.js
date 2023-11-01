import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

export default function StudentHomeView() {
  const [promotions, setPromotions] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const promotionsRef = ref(db, 'promotions');

    const promotionsListener = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promotionsData = snapshot.val();
        setPromotions(promotionsData);
        setDataFetched(true); // Set dataFetched to true once data is available
      }
    });

    return () => {
      promotionsListener(); // Clean up the listener when the component unmounts
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // Navigate to 'StudentHomePromotion' when an item is pressed
        navigation.navigate('StudentHomePromotion', { /* pass any params you need */ });
      }}
    >
      <Text style={styles.itemName}>{`${item.discount}% off for ${item.daysDifference} days`}</Text>
      <Text style={styles.itemPrice}>{item.foodDiscountDescription}</Text>
      <Text style={styles.itemPrice}>{item.storeName}</Text>
      <Text style={styles.itemPrice}>{item.location}</Text>
    </TouchableOpacity>
  );

  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Promo</Text>
      {dataFetched && (
        <View style={styles.dataContainer}>
          <Carousel
            data={promotions}
            renderItem={renderItem}
            sliderWidth={300} // Adjust the width as needed
            itemWidth={300}   // Adjust the width as needed
          />
        </View>
      )}
      <Text style={styles.header}>Recommendations</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataContainer: {
    // Styles for data container
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
});

// import React, { useState, useEffect,B useRef } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
// import Axios from 'axios';
// import { useCart } from '../../Context/CartContext';

// export default function StudentHomeView() {
//   const [data, setData] = useState(null);
//   const [promotions, setPromotions] = useState([]);
//   const { addToCart } = useCart();
//   const promoSlider = useRef();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await Axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/foodmenu.json');
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }

//       try {
//         const promoResponse = await Axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/promotion.json');
//         setPromotions(Object.values(promoResponse.data));
//       } catch (error) {
//         console.error('Error fetching promotions:', error);
//       }
//     }

//     fetchData();
//   }, []);

//   const addToCartAndNavigate = (item) => {
//     addToCart(item);
//   };

//   function renderPromoItem({ item }) {
//     return (
//       <View style={styles.card}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {/* White square shape */}
//               <View style={styles.whiteSquare}></View>
//         </View>
//         <Image source={{ uri: item.imageUrl }} style={styles.image} />
//         <View style={styles.textContainer}>
//           <Text style={styles.discountPrice}>{item.discountPrice}</Text>
//           <Text style={styles.foodName}>{item.foodName}</Text>
//           <Text style={styles.originalPrice}>{item.originalPrice}</Text>
//         </View>
//       </View>
//     );
//   }

//   const renderRecommendedItem = () => {
//     if (!data) {
//       return null;
//     }

//     const recommendedItemKey = Object.keys(data)[0];
//     const item = data[recommendedItemKey];

//     return (
//       <View style={styles.card}>
//         <View style={styles.recommendedContent}>
//         {/* White square shape */}
//         <View style={styles.whiteSquare}></View>
//           <Image source={{ uri: item.imageUrl }} style={styles.image} />
//           <View style={styles.textContainer}>
//             <Text style={{ top: 35, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>{item.price}</Text>
//             <Text style={{ top: -40, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>{item.name}</Text>
//             <Text style={{ top: 5,left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>{item.type}</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => addToCartAndNavigate(item)} style={styles.addButton}>
//           <Text style={styles.buttonText}>+</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

// const handleScrollLeft = () => {
//     const nextIndex = (currentIndex - 1 + promotions.length) % promotions.length;
//     promoSlider.current.scrollToIndex({ index: nextIndex });
//     setCurrentIndex(nextIndex);
//   };

//   const handleScrollRight = () => {
//     const nextIndex = (currentIndex + 1) % promotions.length;
//     promoSlider.current.scrollToIndex({ index: nextIndex });
//     setCurrentIndex(nextIndex);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Promo</Text>
//       <FlatList
//         data={promotions}
//         renderItem={renderPromoItem}
//         horizontal
//         pagingEnabled
//         keyExtractor={(item, index) => `${item.title}-${index}`}
//         showsHorizontalScrollIndicator={false}
//         ref={promoSlider}
//         onMomentumScrollEnd={(event) => {
//           const newIndex = Math.floor(event.nativeEvent.contentOffset.x / 345);
//           setCurrentIndex(newIndex);
//         }}
//       />
//       <View style={styles.promoControls}>
//         <TouchableOpacity onPress={handleScrollLeft} style={styles.promoControlButton}>
//           <Text style={styles.promoControlText}> {'<'}  </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleScrollRight} style={styles.promoControlButton}>
//           <Text style={styles.promoControlText}> {'>'}  </Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.headerText}>Recommended for you</Text>
//       {renderRecommendedItem()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'maroon',
//   },
//   card: {
//     width: 345,
//     height: 140,
//     borderRadius: 10,
//     padding: 10,
//     margin: 10,
//     backgroundColor: '#FFAD31',
//     elevation: 5,
//   },
//   image: {
//     width: 150,
//     height: 100,
//     marginRight: 10,
//   },
//   textContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   discountPrice: {
//     fontWeight: 'bold',
//     left: 170,
//     fontSize: 25,
//     height: 100,
//     top:-60 ,
//     color: 'black',
//   },
//   foodName: {
//     fontWeight: 'bold',
//     left: 170,
//     fontSize: 25,
//     height: 100,
//     top: -120,
//     color: 'black',
//   },
//   originalPrice: {
//     fontWeight: 'bold',
//     left: 170,
//     fontSize: 25,
//     top: -180,
//     height: 100,
//     color: 'black',
//   },
//   recommendedContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addButton: {
//     position: 'absolute',
//     width: 30,
//     height: 30,
//     top: 102,
//     right: 5,
//     backgroundColor: 'maroon',
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: 'maroon',
//     borderWidth: 1,
//   },
//   buttonText: {
//     fontSize: 25,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   promoControls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   promoControlButton: {
//     backgroundColor: 'white',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginHorizontal: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   promoControlText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'maroon',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   whiteSquare: {
//     backgroundColor: 'white',
//     width: 150,
//     height: 117,
//     borderRadius: 15,
//     marginRight: -150,
//   },
// });