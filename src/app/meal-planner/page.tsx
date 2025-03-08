'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface Nutrient {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface FoodItem {
  fdcId: string;
  name: string;
  brandOwner: string;
  servingSize: number;
  servingSizeUnit: string;
  nutrients: Nutrient;
  baseNutrients?: Nutrient;
}

interface Meal {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState<Meal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      searchFoods(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const searchFoods = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/food-search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search foods');
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching foods:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const updateNutrientsForQuantity = (baseNutrients: Nutrient, newQuantity: number) => {
    return {
      calories: Math.round(baseNutrients.calories * newQuantity),
      protein: Math.round(baseNutrients.protein * newQuantity * 10) / 10,
      carbs: Math.round(baseNutrients.carbs * newQuantity * 10) / 10,
      fats: Math.round(baseNutrients.fats * newQuantity * 10) / 10,
    };
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (selectedFood?.baseNutrients) {
      const updatedNutrients = updateNutrientsForQuantity(selectedFood.baseNutrients, newQuantity);
      setNewMeal(prev => ({
        ...prev,
        calories: updatedNutrients.calories,
        protein: updatedNutrients.protein,
        carbs: updatedNutrients.carbs,
        fats: updatedNutrients.fats,
      }));
    }
  };

  const selectFood = (food: FoodItem) => {
    const baseNutrients = {
      calories: food.nutrients.calories,
      protein: food.nutrients.protein,
      carbs: food.nutrients.carbs,
      fats: food.nutrients.fats,
    };

    const foodWithBase = {
      ...food,
      baseNutrients,
    };

    setSelectedFood(foodWithBase);
    setQuantity(1);
    setNewMeal({
      name: `${food.name} (${food.servingSize}${food.servingSizeUnit})`,
      calories: Math.round(food.nutrients.calories),
      protein: Number(food.nutrients.protein.toFixed(1)),
      carbs: Number(food.nutrients.carbs.toFixed(1)),
      fats: Number(food.nutrients.fats.toFixed(1)),
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/meals');
      if (!response.ok) throw new Error('Failed to fetch meals');
      const data = await response.json();
      setMeals(data);
    } catch (err) {
      setError('Failed to load meals');
      console.error('Error:', err);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const mealToAdd = {
        ...newMeal,
        name: quantity > 1 
          ? `${quantity}x ${newMeal.name}`
          : newMeal.name,
      };

      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealToAdd),
      });

      if (!response.ok) throw new Error('Failed to add meal');
      
      const addedMeal = await response.json();
      setMeals([addedMeal, ...meals]);
      setNewMeal({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });
      setSelectedFood(null);
      setQuantity(1);
    } catch (err) {
      setError('Failed to add meal');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    return meals.reduce((acc, meal) => ({
      calories: Math.round(acc.calories + meal.calories),
      protein: Math.round((acc.protein + meal.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + meal.carbs) * 10) / 10,
      fats: Math.round((acc.fats + meal.fats) * 10) / 10,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">Daily Meal Planner</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Add Meal Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Meal</h2>
              <form onSubmit={handleAddMeal} className="space-y-6">
                <div className="relative">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Search Food</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                    placeholder="Start typing to search foods..."
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-12">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {searchResults.map((food) => (
                        <button
                          key={food.fdcId}
                          type="button"
                          onClick={() => selectFood(food)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-600">
                            {food.brandOwner} • {food.servingSize}{food.servingSizeUnit} • 
                            {food.nutrients.calories} cal
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                    required
                  />
                </div>
                {selectedFood && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Quantity (x{selectedFood.servingSize}{selectedFood.servingSizeUnit})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number(e.target.value))}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Calories</label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Fats (g)</label>
                    <input
                      type="number"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Adding...' : 'Add Meal'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Daily Totals and Meal List */}
          <div className="lg:w-1/2 space-y-8">
            {/* Daily Totals */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Daily Totals</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Calories</h3>
                  <p className="text-3xl font-extrabold text-blue-800">{Math.round(totals.calories)}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-green-900 mb-2">Protein</h3>
                  <p className="text-3xl font-extrabold text-green-800">{totals.protein}g</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">Carbs</h3>
                  <p className="text-3xl font-extrabold text-yellow-800">{totals.carbs}g</p>
                </div>
                <div className="bg-red-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Fats</h3>
                  <p className="text-3xl font-extrabold text-red-800">{totals.fats}g</p>
                </div>
              </div>
            </div>

            {/* Meal List */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Today's Meals</h2>
              {meals.length === 0 ? (
                <p className="text-xl text-gray-600 text-center py-8">No meals added yet</p>
              ) : (
                <div className="space-y-4">
                  {meals.map((meal) => (
                    <div key={meal.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{meal.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 mb-1">{Math.round(meal.calories)} calories</p>
                          <p className="text-lg text-gray-700">
                            <span className="font-semibold text-blue-700">P: {meal.protein}g</span> | 
                            <span className="font-semibold text-yellow-700"> C: {meal.carbs}g</span> | 
                            <span className="font-semibold text-red-700"> F: {meal.fats}g</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 