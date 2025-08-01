import { NextResponse } from 'next/server';
import { getAllMenuItems } from '@/data/menuData'; 
import { MenuItem } from '@/types/api'; 

// A simple utility to perform a case-insensitive search across specified fields
const searchItems = (query: string): MenuItem[] => {
  const allItems = getAllMenuItems();
  const lowerCaseQuery = query.toLowerCase();

  return allItems.filter(item => {
    // Check item name in both English and Farsi
    const nameMatch = 
      item.name.en.toLowerCase().includes(lowerCaseQuery) ||
      item.name.fa.toLowerCase().includes(lowerCaseQuery);

    // Check item description in both English and Farsi
    const descriptionMatch =
      item.description.en.toLowerCase().includes(lowerCaseQuery) ||
      item.description.fa.toLowerCase().includes(lowerCaseQuery);
    
    // Check item category
    const categoryMatch = 
      item.category.toLowerCase().includes(lowerCaseQuery);

    return nameMatch || descriptionMatch || categoryMatch;
  });
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: "No search query provided." }, { status: 400 });
    }

    const results = searchItems(query);
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}