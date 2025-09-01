import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const IngredientDetails = ({ route, navigation }) => {
  const { ingredient } = route.params || {};
  const [selectedPortion, setSelectedPortion] = useState('1');

  const handleBack = () => {
    navigation.goBack();
  };

  // Base quantities for 1 portion
  const baseQuantities = {
    'Paneer (Cottage Cheese)': { amount: 100, unit: 'g' },
    'Onion': { amount: 1, unit: 'pc' },
    'Capsicum': { amount: 50, unit: 'g' },
    'Tomato': { amount: 3, unit: 'g' },
    'Fresh Cream': { amount: 50, unit: 'ml' }
  };

  // Calculate quantity based on selected portion
  const getIngredientQuantity = (ingredientName) => {
    const base = baseQuantities[ingredientName];
    if (!base) return '';
    
    const totalAmount = base.amount * parseInt(selectedPortion, 10);
    return `${String(totalAmount).padStart(2, '0')}${base.unit === 'pc' ? ' pc' : base.unit}`;
  };

  if (!ingredient) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ingredient Details</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Image 
          source={{ uri: ingredient.image }} 
          style={styles.ingredientImage}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.ingredientName}>{ingredient.name || 'Ingredient Name'}</Text>
          <Text style={styles.ingredientDescription}>
            {ingredient.description}
          </Text>

          {/* Portion People */}
          <View style={styles.portionContainer}>
            <Text style={styles.sectionTitle}>Select People</Text>
            <View style={styles.portionOptions}>
              {['1', '2', '3', '4'].map((portion) => (
                <TouchableOpacity
                  key={portion}
                  style={[
                    styles.portionButton,
                    selectedPortion === portion && styles.selectedPortionButton
                  ]}
                  onPress={() => setSelectedPortion(portion)}
                >
                  <Text style={[
                    styles.portionText,
                    selectedPortion === portion && styles.selectedPortionText
                  ]}>
                    {portion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredient Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Ingredient Details</Text>
            <View style={styles.ingredientsList}>
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>Paneer (Cottage Cheese)</Text>
                <Text style={styles.ingredientQuantity}>{getIngredientQuantity('Paneer (Cottage Cheese)')}</Text>
              </View>
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>Onion</Text>
                <Text style={styles.ingredientQuantity}>{getIngredientQuantity('Onion')}</Text>
              </View>
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>Capsicum</Text>
                <Text style={styles.ingredientQuantity}>{getIngredientQuantity('Capsicum')}</Text>
              </View>
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>Tomato</Text>
                <Text style={styles.ingredientQuantity}>{getIngredientQuantity('Tomato')}</Text>
              </View>
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>Fresh Cream</Text>
                <Text style={styles.ingredientQuantity}>{getIngredientQuantity('Fresh Cream')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    paddingTop: height * 0.04,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -width * 0.02,
    borderRadius: width * 0.05,
    marginTop: height * 0.015,
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    marginLeft: width * 0.06,
    color: '#333',
    marginTop: height * 0.015,
  },
  headerIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  ingredientImage: {
    width: '100%',
    height: height * 0.3,
    marginTop: height * 0.02,
  },
  infoContainer: {
    padding: width * 0.04,
  },
  ingredientInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8%',
  },
  ingredientTitle: {
    fontSize: '6%',
    fontWeight: 'bold',
    flex: 1,
  },
  ingredientDescription: {
    color: '#666',
    fontSize: '3.5%',
    lineHeight: '2.5%',
    marginBottom: '3%',
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: height * 0.015,
  },
  portionContainer: {
    marginBottom: 24,
  },
  portionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  portionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.01,
    margin: width * 0.005,
    minWidth: width * 0.22,
    alignItems: 'center',
  },
  selectedPortionButton: {
    borderColor: '#0F9D58',
    backgroundColor: 'rgba(15, 157, 88, 0.1)',
  },
  portionText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  selectedPortionText: {
    color: '#0F9D58',
    fontWeight: '600',
  },

  detailsContainer: {
    marginBottom: 24,
  },
  ingredientsList: {
    marginTop: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  ingredientName: {
    fontSize: width * 0.035,
    color: '#333',
    flex: 2,
  },
  ingredientQuantity: {
    fontSize: width * 0.035,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: '#666',
    fontSize: 14,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addToCartButton: {
    backgroundColor: '#0F9D58',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default IngredientDetails;
