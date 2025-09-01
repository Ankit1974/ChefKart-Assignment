import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
import Icon from 'react-native-vector-icons/MaterialIcons';

const DishItem = memo(({ dish, isSelected, onToggle, onIngredientPress }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 60;
  // Check if description is longer than max length
  const shouldTruncate = dish.description.length > maxLength;
  // Show full description if expanded, otherwise show smaller version 
  const displayText = expanded
    ? dish.description
    : `${dish.description.substring(0, maxLength)}${shouldTruncate ? '...' : ''}`;

  return (
    <View style={styles.dishCard}>
      <View style={styles.dishInfo}>
        <View style={styles.dishHeader}>
          <Text style={styles.dishName}>{dish.name}</Text>
          {/* Veg/Non-veg indicator icon */}
          <View style={[
            styles.ingredientsIcon,
            { borderColor: dish.type === 'veg' ? '#539A64' : '#E2574C' }
          ]}>
            <View style={[
              styles.ingredientsIconEllipse,
              { backgroundColor: dish.type === 'veg' ? '#539A64' : '#E2574C' }
            ]} />
          </View>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.dishDescription}>
            {displayText}
            {/* Show 'Read More' button */}
            {shouldTruncate && !expanded && (
              <Text
                style={styles.readMoreText}
                onPress={() => setExpanded(true)}
              >
                {' '}Read More
              </Text>
            )}
          </Text>
          {/* Show 'Show Less' button */}
          {shouldTruncate && expanded && (
            <Text
              style={[styles.readMoreText, styles.readMoreRight]}
              onPress={() => setExpanded(false)} 
            >
              Show Less
            </Text>
          )}
        </View>
        {/* Ingredients button */}
        <TouchableOpacity
          style={styles.ingredientsHeader}
          onPress={() => onIngredientPress(dish)}
        >
          <Icon
            name="spa"
            size={16}
            color="#FF8800"
            style={styles.ingredientIcon}
          />
          <Text style={styles.ingredientsText}>Ingredients</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dishImageContainer}>
        {/* Dish image */}
        <Image
          source={{ uri: dish.image }}
          style={styles.dishImage}
          resizeMode="cover"
        />
        {/* Add/Remove button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onToggle(dish.id)}
        >
          <View style={styles.addButtonContent}>
            <Text style={styles.addButtonText}>
              {isSelected ? 'Remove' : 'Add'}
            </Text>
            {/* Show plus icon only when not selected */}
            {!isSelected && <Text style={styles.plusIcon}> +</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
  },
  dishInfo: {
    flex: 1,
    marginRight: width * 0.04,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  dishName: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333333',
    marginTop: height * 0.015,
    marginBottom: height * 0.005,
    marginRight: width * 0.01,
  },
  descriptionContainer: {
    marginBottom: height * 0.005,
  },
  dishDescription: {
    fontSize: width * 0.03,
    color: '#666666',
    marginBottom: height * 0.015,
    lineHeight: height * 0.022,
  },
  readMoreText: {
    color: '#000000',
    fontWeight: '500',
  },
  readMoreRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  ingredientsIcon: {
    marginTop: height * 0.015,
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: width * 0.01,
    borderWidth: 1,
    padding: width * 0.01,
    marginRight: width * 0.015,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsIconEllipse: {
    width: width * 0.015,
    height: width * 0.015,
    borderRadius: width * 0.0075,
  },
  ingredientsText: {
    fontSize: width * 0.035,
    color: '#FF8800',
    fontWeight: '600',
    marginLeft: width * 0.02,
  },
  ingredientIcon: {
    marginRight: 4,
  },
  dishImageContainer: {
    position: 'relative',
    marginLeft: width * 0.03,
    justifyContent: 'center',
  },
  dishImage: {
    width: width * 0.3,
    height: height * 0.1375,
    borderRadius: width * 0.0375,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  addButton: {
    position: 'absolute',
    bottom: -height * 0.0125,
    marginTop: -height * 0.0125,
    right: width * 0.0425,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.0075,
    borderRadius: width * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.2075,
    height: height * 0.035,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#73AE78',
    fontSize: width * 0.0375,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: height * 0.02,
    marginRight: width * 0.005,
  },
  plusIcon: {
    color: '#73AE78',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    lineHeight: height * 0.02,
    marginTop: -height * 0.00125,
  },
});

export default DishItem;
