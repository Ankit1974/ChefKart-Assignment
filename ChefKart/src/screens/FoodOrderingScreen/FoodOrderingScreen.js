import React, { useState, useCallback, useMemo, memo } from 'react';
import { dishes as mockDishes, categories } from '../../MockData/dishes';
import DishItem from '../../components/DishItem/DishItem';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const categoryToMealType = {
  'Main Course': 'MAIN COURSE',
  'Starter': 'STARTER',
  'Dessert': 'DESSERT',
  'Sides': 'SIDES'
};

const getMealTypeCategory = (mealType) => ({
  'STARTER': 'Starter',
  'MAIN COURSE': 'Main Course',
  'DESSERT': 'Dessert',
  'SIDES': 'Sides'
}[mealType]);

const FoodOrderingScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Starter');
  const [northIndianExpanded, setNorthIndianExpanded] = useState(true);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [vegFilter, setVegFilter] = useState(true);
  const [nonVegFilter, setNonVegFilter] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();

  // Navigate to ingredient details screen with dish information
  const handleIngredientPress = useCallback((dish) => {
    navigation.navigate('IngredientDetails', {
      ingredient: {
        name: dish.name || 'Ingredient',
        description: 'Fresh and high-quality ingredient for your dish.',
        price: Math.floor(Math.random() * 100) + 50,
        image: dish.image,
        type: dish.type || 'veg', 
        shelfLife: '3-4 days',
        storage: 'Refrigerate'
      }
    });
  }, [navigation]);


  const categoryToMealType = {
    'Main Course': 'MAIN COURSE',
    'Starter': 'STARTER',
    'Dessert': 'DESSERT',
    'Sides': 'SIDES'
  };

  // Filter dishes based on active filters and search query
  const filteredDishes = useMemo(() => {
    let result = mockDishes;
    const trimmedQuery = searchQuery.trim().toLowerCase();
    // Convert active category to meal type format if not 'All'
    const mealType = activeCategory !== 'All' ? categoryToMealType[activeCategory] : null;

    // Return all dishes if no filters are active
    if (vegFilter && nonVegFilter && !trimmedQuery && !mealType) {
      return result;
    }

    // Apply all active filters in a single pass
    result = mockDishes.filter(dish => {
      // Show only veg dishes if non-veg filter is off
      if (vegFilter && !nonVegFilter && dish.type !== 'veg') return false;
      // Show only non-veg dishes if veg filter is off
      if (!vegFilter && nonVegFilter && dish.type === 'veg') return false;
      
      // Filter by selected meal category
      if (mealType && dish.mealType !== mealType) return false;
      
      // Filter by search term in dish name
      if (trimmedQuery && !dish.name.toLowerCase().includes(trimmedQuery)) return false;
      
      return true; // Include dish if it passes all filters
    });

    return result;
  }, [activeCategory, mockDishes, searchQuery, vegFilter, nonVegFilter]);

  // Count selected dishes by category for the category tabs
  const categoryCounts = useMemo(() => {
    // Initialize counts for all categories to 0
    const counts = categories.reduce((acc, category) => ({
      ...acc,
      [category.name]: 0
    }), {});

    // Count selected dishes in each category
    return Object.entries(selectedDishes).reduce((acc, [dishId, count]) => {
      if (count > 0) {
        const dish = mockDishes.find(d => d.id === dishId);
        if (dish) {
          // Get the display name of the meal type
          const categoryName = getMealTypeCategory(dish.mealType);
          if (categoryName) {
            // Increment count for this category
            acc[categoryName] = (acc[categoryName] || 0) + count;
          }
        }
      }
      return acc;
    }, { ...counts }); // Start with initialized counts
  }, [selectedDishes, mockDishes, categories]);

  const toggleDishSelection = useCallback((dishId) => {
    setSelectedDishes(prev => ({
      ...prev,
      [dishId]: prev[dishId] ? 0 : 1,
    }));
  }, []);

  const totalSelected = Object.values(selectedDishes).reduce((sum, count) => sum + count, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="chevron-back" size={24} color="#000" style={styles.backIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes for your party..."
            placeholderTextColor="#606060"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={20} color="#606060" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
          )}
        </View>
      </View>

      <View style={styles.categoriesOuterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.name && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.name && styles.activeCategoryText,
                ]}
              >
                {category.name} {categoryCounts[category.name] || 0}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All'
              ? `All Dishes Selected ${totalSelected}`
              : `${activeCategory} Selected ${categoryCounts[activeCategory] || 0}`}
          </Text>
          <View style={styles.toggleContainer}>
            <View style={[
              styles.toggleItem,
              styles.vegToggleContainer,
              {
                backgroundColor: '#FFFFFF',
                borderColor: '#F3F3F3',
                borderWidth: 2,
              }
            ]}>
              <Switch
                value={vegFilter}
                onValueChange={setVegFilter}
                thumbColor="#0F9D58"
                trackColor={{ false: '#E0E0E0', true: '#0F9D58' }}
                style={styles.toggleSwitch}
              />
            </View>
            <View style={[
              styles.toggleItem,
              {
                marginLeft: 6,
                backgroundColor: '#FFFFFF',
                borderColor: '#F3F3F3',
                borderWidth: 2,
              }
            ]}>
              <Switch
                value={nonVegFilter}
                onValueChange={setNonVegFilter}
                thumbColor="#DB4437"
                trackColor={{ false: '#E0E0E0', true: '#DB4437' }}
                style={styles.toggleSwitch}
              />
            </View>
          </View>
        </View>

        <View style={styles.cuisineSection}>
          <TouchableOpacity
            style={styles.cuisineHeader}
            onPress={() => setNorthIndianExpanded(!northIndianExpanded)}
          >
            <Text style={styles.cuisineTitle}>North Indian</Text>
            <Icon
              name={northIndianExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {northIndianExpanded && (
            <FlatList
              data={filteredDishes}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item: dish }) => (
                <DishItem
                  dish={dish}
                  isSelected={!!selectedDishes[dish.id]}
                  onToggle={toggleDishSelection}
                  onIngredientPress={handleIngredientPress}
                />
              )}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={50}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No dishes available</Text>
              )}
            />
          )}
        </View>
      </View>

      <View style={styles.footerLeft}>
        <Text style={styles.totalDishes}>Total Dish Selected   {totalSelected}</Text>
        <View style={{ width: 215 }} />
        <Icon
          name="keyboard-arrow-right"
          size={33}
          color="black"
          style={{ fontWeight: 'bold' }}
        />
      </View>
      <TouchableOpacity style={styles.continueButton}>

        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  time: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 4,
    backgroundColor: '#fff',
  },
  backIcon: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 57,
    borderColor: '#ADADAD',
    borderWidth: 1,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  categoriesOuterContainer: {
    backgroundColor: '#fff',
    height: 44,
    justifyContent: 'center',
    marginTop: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 35,
    justifyContent: 'center',
    borderColor: '#ADADAD',
    borderWidth: 1,
  },
  activeCategoryButton: {
    backgroundColor: '#FF941A',
  },
  categoryText: {
    fontSize: 14,
    color: '#1C1C1C',
    fontWeight: '500',
    lineHeight: 16,
  },
  activeCategoryText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  listContentContainer: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    borderRadius: 20,
    borderWidth: 0.0000002,
    borderColor: '#F3F3F3',
  },
  vegToggleContainer: {
  },
  activeToggleLabel: {
    color: '#0F9D58',
    fontWeight: '500',
  },
  activeToggleItem: {

  },
  activeToggleLabel: {
    fontWeight: '600',
  },
  vegToggle: {
    borderWidth: 1,
    borderColor: '#0F9D58',
    backgroundColor: 'rgba(15, 157, 88, 0.1)',
    borderRadius: 16,
    marginRight: 8,
  },
  nonVegToggle: {
    borderWidth: 1,
    borderColor: '#DB4437',
    backgroundColor: 'rgba(219, 68, 55, 0.1)',
    borderRadius: 16,
  },
  toggleBox: {
    width: 16,
    height: 16,
    borderRadius: 4.73,
    marginRight: 4,
    borderWidth: 1.18,
  },
  vegBox: {
    backgroundColor: '#0F9D58',
    borderColor: '#0A7E3F',
  },
  nonVegBox: {
    backgroundColor: '#DB4437',
    borderColor: '#B71C1C',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  customBox: {
    width: 16,
    height: 16,
    borderWidth: 1.18,
    borderRadius: 4.73,
    padding: 4.73,
    gap: 11.82,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    marginTop: 8,
  },
  toggleSwitch: {
    transform: [{ scale: 0.8 }],
  },
  cuisineSection: {
    marginBottom: 12,
  },
  cuisineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  cuisineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
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
  vegIndicator: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
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
    borderColor: '#E0E0E0',
    padding: 4,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginTop: 13,
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
    marginRight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFAF4',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'center',
    width: '100%',
    marginLeft: 21,
  },
  totalDishes: {
    fontSize: 14,
    color: '#1C1C1C',
    marginRight: 8,
    fontWeight: '500',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#1C1C1C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default FoodOrderingScreen;