import { NextResponse } from 'next/server';

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_ENDPOINT = process.env.USDA_API_ENDPOINT;

// Nutrient IDs from USDA database
const NUTRIENT_IDS = {
  CALORIES: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FATS: 1004,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const response = await fetch(`${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&dataType=SR Legacy,Survey (FNDDS),Foundation,Branded&pageSize=10`);
    
    if (!response.ok) {
      throw new Error('USDA API request failed');
    }

    const data = await response.json();
    
    // Transform the USDA response to match our application's needs
    const foods = data.foods.map((food: any) => {
      const nutrients = food.foodNutrients || [];
      
      // Helper function to find nutrient value
      const findNutrient = (nutrientId: number) => {
        const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
        return nutrient ? nutrient.value : 0;
      };

      // Find nutrient values
      const calories = findNutrient(NUTRIENT_IDS.CALORIES);
      const protein = findNutrient(NUTRIENT_IDS.PROTEIN);
      const carbs = findNutrient(NUTRIENT_IDS.CARBS);
      const fats = findNutrient(NUTRIENT_IDS.FATS);

      return {
        fdcId: food.fdcId,
        name: food.description,
        brandOwner: food.brandOwner || 'Generic',
        servingSize: food.servingSize || 100,
        servingSizeUnit: food.servingSizeUnit || 'g',
        nutrients: {
          calories,
          protein,
          carbs,
          fats
        }
      };
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error('Food search error:', error);
    return NextResponse.json(
      { error: 'Failed to search foods' },
      { status: 500 }
    );
  }
} 