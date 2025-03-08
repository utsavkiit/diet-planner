import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const meals = await prisma.meal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching meals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const meal = await prisma.meal.create({
      data: {
        name: body.name,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
      },
    });
    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating meal' }, { status: 500 });
  }
} 