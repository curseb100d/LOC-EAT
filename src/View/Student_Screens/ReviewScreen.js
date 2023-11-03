import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from '../../Components/config';

const ReviewScreen = ({ route }) => {
  const { storeData, user } = route.params;

  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedReview, setEditedReview] = useState(null);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  useEffect(() => {
    const reviewsRef = ref(db, 'reviews');
    onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const reviewsArray = Object.entries(data).map(([id, review]) => ({ id, ...review }));
          const storeReviews = reviewsArray.filter((review) => review.storeName === storeData.storeName);
          setReviews(storeReviews);
        }
      }
    });
  }, [storeData]);

  const handleAddReview = () => {
    if (text && rating > 0) {
      const newReview = {
        storeName: storeData.storeName,
        reviewText: text,
        rating: rating,
        firstName: user?.firstName || 'Unknown First Name',
      };

      const newReviewRef = push(ref(db, 'reviews'));
      const newReviewId = newReviewRef.key;

      set(newReviewRef, newReview);

      setReviews([...reviews, { id: newReviewId, ...newReview }]);

      setText('');
      setRating(0);

      setModalVisible(false);
    }
  };

  const handleEditReview = () => {
    if (text && rating > 0 && editedReview) {
      const editedReviewData = {
        storeName: storeData.storeName,
        reviewText: text,
        rating: rating,
        firstName: user?.firstName || 'Unknown First Name',
      };

      const reviewRef = ref(db, `reviews/${editedReview.id}`);
      set(reviewRef, editedReviewData);

      setReviews((prevReviews) =>
        prevReviews.map((prevReview) => (prevReview.id === editedReview.id ? { id: editedReview.id, ...editedReviewData } : prevReview))
      );

      setText('');
      setRating(0);
      setEditedReview(null);
      setEditModalVisible(false);
    }
  };

  const confirmDeleteReview = (reviewId) => {
    setDeleteReviewId(reviewId);
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', onPress: () => setDeleteReviewId(null), style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteReview },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteReview = () => {
    if (deleteReviewId) {
      const reviewRef = ref(db, `reviews/${deleteReviewId}`);
      remove(reviewRef)
        .then(() => {
          setReviews(reviews.filter((review) => review.id !== deleteReviewId));
          setDeleteReviewId(null);
        })
        .catch((error) => {
          console.error('Error deleting review:', error);
          setDeleteReviewId(null);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Reviews for {storeData.storeName}</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addReviewButton}>
        <Text style={styles.addReviewButtonText}>Add Review</Text>
      </TouchableOpacity>

      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewText}>{item.reviewText}</Text>
            <Text style={styles.reviewRating}>{item.rating} stars</Text>
            <Text style={styles.reviewUser}>{`Reviewed by: ${item.firstName}`}</Text>
            <TouchableOpacity
              onPress={() => {
                setText(item.reviewText);
                setRating(item.rating);
                setEditedReview(item);
                setEditModalVisible(true);
              }}
              style={styles.editReviewButton}
            >
              <Text style={styles.editReviewButtonText}>Edit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDeleteReview(item.id)}
              style={styles.deleteReviewButton}
            >
              <Text style={styles.deleteReviewButtonText}>Delete Review</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        {/* Add Review Modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Review</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={rating}
              starSize={30}
              fullStarColor="gold"
              selectedStar={(rating) => setRating(rating)}
            />
            <TextInput
              placeholder="Your review..."
              value={text}
              onChangeText={(text) => setText(text)}
              style={styles.modalInput}
              multiline={true}
            />
            <TouchableOpacity onPress={handleAddReview} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={isEditModalVisible}>
        {/* Edit Review Modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Review</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={rating}
              starSize={30}
              fullStarColor="gold"
              selectedStar={(rating) => setRating(rating)}
            />
            <TextInput
              placeholder="Edit your review..."
              value={text}
              onChangeText={(text) => setText(text)}
              style={styles.modalInput}
              multiline={true}
            />
            <TouchableOpacity onPress={handleEditReview} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addReviewButton: {
    backgroundColor: 'maroon',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButtonText: {
    color: 'white',
  },
  reviewItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  reviewText: {
    fontSize: 16,
    marginTop: 10,
  },
  reviewRating: {
    fontSize: 16,
    color: 'maroon',
  },
  reviewUser: {
    fontSize: 14,
  },
  editReviewButton: {
    backgroundColor: 'maroon',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  editReviewButtonText: {
    color: 'white',
  },
  deleteReviewButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteReviewButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'maroon',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
