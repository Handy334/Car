export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number; // Simplified to single price for easier sorting/filtering
  horsepower: number;
  mpg: number; // Combined MPG for simplicity
  imageUrl: string;
  dataAiHint: string;
  features?: string[];
};

export type Filters = {
  make: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
};

export type SortOption = 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'make_asc' | 'make_desc';

// Тип для данных формы добавления автомобиля
export interface AddCarFormData {
  make: string;
  model: string;
  year: string; // Будет строкой из формы, затем преобразуется в число
  price: string; // Будет строкой из формы, затем преобразуется в число
  horsepower: string; // Будет строкой из формы, затем преобразуется в число
  mpg: string; // Будет строкой из формы, затем преобразуется в число
  imageUrl: string;
  dataAiHint: string;
  features: string; // Пользователь вводит через запятую
}

// Тип для новостной статьи
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string; // Формат YYYY-MM-DD
  author: string;
  imageUrl: string;
  dataAiHint: string;
  summary: string;
  content: string; // Полное содержание статьи, может содержать HTML или Markdown
}
