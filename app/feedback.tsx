import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  transactionId?: string;
  pfiName?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose, transactionId, pfiName }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const submitFeedback = async () => {
    if (rating === null) {
      Alert.alert('Please provide a rating.');
      return;
    }

      Alert.alert('Thank you for your feedback!');
      onClose();

    //   Alert.alert('Error submitting feedback, please try again.');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
        <View className='flex-1 justify-center items-center bg-gray-300 bg-opacity-50'>
        <View className="bg-white m-auto p-4 rounded-lg shadow-lg">
            <Text className="text-lg font-bold">Rate your experience with {pfiName}</Text>
            
            <View className="flex-row justify-around mt-4 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Ionicons
                    name={star <= (rating || 0) ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= (rating || 0) ? 'gold' : 'gray'}
                />
                </TouchableOpacity>
            ))}
            </View>

            <TextInput
            className="border rounded p-2 mb-4"
            placeholder="Leave additional feedback..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            />

            <TouchableOpacity className="bg-secondary py-2 px-4 rounded-md" onPress={submitFeedback}>
            <Text className="text-white text-center font-bold">Submit Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-300 py-2 px-4 rounded-md mt-2" onPress={onClose}>
            <Text className="text-center font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
        </View>
        </View>
    </Modal>
  );
};

export default FeedbackModal;
