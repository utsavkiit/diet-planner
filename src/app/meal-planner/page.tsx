'use client';

import { useState } from 'react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
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

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    setMeals([...meals, newMeal]);
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
  };

  const calculateTotals = () => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">Daily Meal Planner</h1>
        
        {/* Add Meal Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Meal</h2>
          <form onSubmit={handleAddMeal} className="space-y-6">
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all"
            >
              Add Meal
            </button>
          </form>
        </div>

        {/* Daily Totals */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Daily Totals</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Calories</h3>
              <p className="text-3xl font-extrabold text-blue-800">{totals.calories}</p>
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
              {meals.map((meal, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{meal.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 mb-1">{meal.calories} calories</p>
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
    </main>
  );
} 