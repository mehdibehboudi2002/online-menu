import { createClient } from "@supabase/supabase-js";
import { MenuItem } from '@/types/api';

// Supabase credentials  
const SUPABASE_URL = "https://cyzwgmruoqhdztzcgcmr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5endnbXJ1b3FoZHp0emNnY21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODcxNjYsImV4cCI6MjA3MDI2MzE2Nn0.h6srWcb98xe9exJZ1CEJg4dLo7nk2-JHaAdm73UiJ3k";

// Supabase client setup 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getAllMenuItemsFromSupabase = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('*, images'); // Select all columns including the 'images' column

  if (error) {
    throw new Error(error.message);
  }
  return data as MenuItem[] || [];
};

export const getItemsByCategoryFromSupabase = async (category: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('*, images') // Select all columns including the 'images' column
    .eq('category', category);

  if (error) {
    throw new Error(error.message);
  }
  return data as MenuItem[] || [];
};

export const getPopularItemsFromSupabase = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('*, images') // Select all columns including the 'images' column
    .eq('is_popular', true);

  if (error) {
    throw new Error(error.message);
  }
  return data as MenuItem[] || [];
};

export const getItemByIdFromSupabase = async (id: string): Promise<MenuItem | null> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('*, images') // Select all columns including the 'images' column
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
        return null;
    }
    throw new Error(error.message);
  }
  return data as MenuItem;
};

export const getCategoriesFromSupabase = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('category');

  if (error) {
    throw new Error(error.message);
  }
  
  const uniqueCategories = new Set(data.map(item => item.category));
  return Array.from(uniqueCategories) as string[];
};

export const searchMenuItemsFromSupabase = async (query: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('MenuItems')
    .select('*, images') // Select all columns including the 'images' column
    .or(
      `name_en.ilike.%${query}%,name_fa.ilike.%${query}%,description_en.ilike.%${query}%,description_fa.ilike.%${query}%,category.ilike.%${query}%`
    );

  if (error) {
    throw new Error(error.message);
  }
  return data as MenuItem[] || [];
};