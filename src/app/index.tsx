import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

type Screen = 'menu' | 'add';

type MenuScreenProps = {
  menuItems: any[];
  clearForm: () => void;
  setScreen: (screen: Screen) => void;
};

type AddMenuScreenProps = {
  clearForm: () => void;
  setScreen: (screen: Screen) => void;
  dishName: string;
  setDishName: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  course: string;
  setCourse: (text: string) => void;
  price: string;
  setPrice: (text: string) => void;
  errors: Record<string, string>;
  setErrors: (errors: any) => void;
  addMenuItem: () => void;
};

export default function App() {

  const [screen, setScreen] = useState<Screen>('menu');

  const [menuItems, setMenuItems] = useState<any[]>([]); 

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

 const [errors, setErrors] = useState<Record<string, string>>({}); 

  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!dishName.trim()) {
      newErrors.dishName = 'Please enter the dish name.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }

    if (!course) {
      newErrors.course = 'Please select a course.';
    }

    if (!price.trim()) {
      newErrors.price = 'Please enter the price.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const addMenuItem = () => {
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: course,
      price: Number(price).toFixed(2),
    };

    setMenuItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    clearForm();

    Alert.alert(
      'Menu Item Added',
      `${newItem.name} has been successfully added to the menu.`,
      [
        {
          text: 'OK',
          onPress: () => setScreen('menu'),
        },
      ]
    );
  };
 if (screen === 'menu') {
    return (
      <MenuScreen 
        menuItems={menuItems} 
        clearForm={clearForm} 
        setScreen={setScreen} 
      />
    );
  }

  return (
    <AddMenuScreen 
      clearForm={clearForm}
      setScreen={setScreen}
      dishName={dishName}
      setDishName={setDishName}
      description={description}
      setDescription={setDescription}
      course={course}
      setCourse={setCourse}
      price={price}
      setPrice={setPrice}
      errors={errors}
      setErrors={setErrors}
      addMenuItem={addMenuItem}
    />
  );
}
 const MenuScreen = ({ menuItems, clearForm, setScreen }: MenuScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Chef's Menu Manager</Text>
        <Text style={styles.subtitle}>Restaurant Menu</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            clearForm();
            setScreen('add');
          }}
        >
          <Text style={styles.primaryButtonText}>+ Add Menu Item</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menu Items</Text>
          <Text style={styles.itemCount}>
            {menuItems.length} item{menuItems.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Menu Items</Text>
            <Text style={styles.emptyText}>
              No menu items have been added yet. Tap "Add Menu Item" to create your first item.
            </Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.menuCard}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.dishName}>{item.name}</Text>
                  <Text style={styles.price}>R{item.price}</Text>
                </View>
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>{item.course}</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// 4. MOVED OUTSIDE APP(): The text inputs can now stay continuously targeted
const AddMenuScreen = ({
  clearForm,
  setScreen,
  dishName,
  setDishName,
  description,
  setDescription,
  course,
  setCourse,
  price,
  setPrice,
  errors,
  setErrors,
  addMenuItem
}: AddMenuScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => {
                clearForm();
                setScreen('menu');
              }}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
            <Text style={styles.screenTitle}>Add Menu Item</Text>
          </View>

          <Text style={styles.screenDescription}>
            Enter the information for the new menu item.
          </Text>

            {/* DISH NAME */}

            <Text style={styles.label}>
              Dish Name
            </Text>

            <TextInput
              style={[
                styles.input,
                errors.dishName && styles.inputError,
              ]}
              placeholder="Enter dish name"
              placeholderTextColor="#999"
              value={dishName}
              onChangeText={(text) => {
                setDishName(text);

                if (errors.dishName) {
                  setErrors({
                    ...errors,
                    dishName: '',
                  });
                }
              }}
            />

            {errors.dishName ? (
              <Text style={styles.errorText}>
                {errors.dishName}
              </Text>
            ) : null}

            {/* DESCRIPTION */}

            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                errors.description && styles.inputError,
              ]}
              placeholder="Enter description"
              placeholderTextColor="#999"
              value={description}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={(text) => {
                setDescription(text);

                if (errors.description) {
                  setErrors({
                    ...errors,
                    description: '',
                  });
                }
              }}
            />

            {errors.description ? (
              <Text style={styles.errorText}>
                {errors.description}
              </Text>
            ) : null}

            {/* COURSE */}

            <Text style={styles.label}>
              Course
            </Text>

            <View
              style={[
                styles.pickerContainer,
                errors.course && styles.inputError,
              ]}
            >
              <Picker
                selectedValue={course}
                onValueChange={(value) => {
                  setCourse(value);

                  if (errors.course) {
                    setErrors({
                      ...errors,
                      course: '',
                    });
                  }
                }}
              >
                <Picker.Item
                  label="Select course"
                  value=""
                />

                <Picker.Item
                  label="Starter"
                  value="Starter"
                />

                <Picker.Item
                  label="Main Course"
                  value="Main Course"
                />

                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />

              </Picker>
            </View>

            {errors.course ? (
              <Text style={styles.errorText}>
                {errors.course}
              </Text>
            ) : null}

            {/* PRICE */}

            <Text style={styles.label}>
              Price
            </Text>

            <View style={styles.priceInputContainer}>

              <Text style={styles.currency}>
                R
              </Text>

              <TextInput
                style={[
                  styles.priceInput,
                  errors.price && styles.inputError,
                ]}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={price}
                keyboardType="decimal-pad"
                onChangeText={(text) => {

              
                  const cleanedText = text.replace(
                    /[^0-9.]/g,
                    ''
                  );

                  setPrice(cleanedText);

                  if (errors.price) {
                    setErrors({
                      ...errors,
                      price: '',
                    });
                  }
                }}
              />

            </View>

            {errors.price ? (
              <Text style={styles.errorText}>
                {errors.price}
              </Text>
            ) : null}

            {/* SAVE BUTTON */}

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={addMenuItem}
            >
              <Text style={styles.saveButtonText}>
                Save Menu Item
              </Text>
            </Pressable>

            {/* CANCEL BUTTON */}

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                clearForm();
                setScreen('menu');
              }}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </Pressable>

          </ScrollView>

        </KeyboardAvoidingView>

      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 25,
  },

  screenTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#202020',
  },

  screenDescription: {
    color: '#777',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 21,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#EAEAEA',
  },

  backButtonText: {
    fontSize: 25,
    color: '#333',
  },

  primaryButton: {
    backgroundColor: '#202020',
    minHeight: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#202020',
  },

  itemCount: {
    fontSize: 14,
    color: '#777',
  },

  listContainer: {
    paddingBottom: 30,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 17,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#E2E2E2',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  dishName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginRight: 10,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202020',
  },

  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    marginBottom: 10,
  },

  courseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },

  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
    lineHeight: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 9,
    paddingHorizontal: 14,
    height: 52,
    fontSize: 15,
    color: '#222',
  },

  multilineInput: {
    height: 105,
    paddingTop: 14,
  },

  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 9,
    overflow: 'hidden',
  },

  inputError: {
    borderColor: '#D64545',
  },

  errorText: {
    color: '#D64545',
    fontSize: 13,
    marginTop: 5,
  },

  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 9,
    height: 52,
    overflow: 'hidden',
  },

  currency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    paddingLeft: 14,
  },

  priceInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#222',
  },

  saveButton: {
    backgroundColor: '#202020',
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 30,
  },

  cancelButtonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.7,
  },

});

