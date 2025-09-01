import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dishInfo: {
    flex: 1,
    marginRight: 16,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 12,
    marginBottom: 4,
    marginRight: 4,
  },
  descriptionContainer: {
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 18,
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
    marginBottom: 8,
  },
  ingredientsIcon: {
    marginTop: 12,
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    padding: 4,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsIconEllipse: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#FF8800',
    fontWeight: '600',
    marginLeft: 8,
  },
  ingredientIcon: {
    marginRight: 4,
  },
  dishImageContainer: {
    position: 'relative',
    marginLeft: 12,
    justifyContent: 'center',
  },
  dishImage: {
    width: 120,
    height: 110,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    marginTop: -10,
    right: 17,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 83,
    height: 28,
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
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
    marginRight: 2,
  },
  plusIcon: {
    color: '#73AE78',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
    marginTop: -1,
  },
});

export default DishItem;
