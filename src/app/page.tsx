import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">Welcome to Diet Planner</h1>
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Personal Nutrition Assistant</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Plan your meals, track your nutrition, and achieve your health goals with our personalized diet planning tool.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Meal Planning</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">Create customized meal plans based on your dietary preferences and goals.</p>
              <Link 
                href="/meal-planner" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Start Planning
              </Link>
            </div>
            <div className="bg-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-green-900">Nutrition Tracking</h3>
              <p className="text-gray-700 text-lg leading-relaxed">Monitor your daily intake of calories, proteins, carbs, and fats.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
