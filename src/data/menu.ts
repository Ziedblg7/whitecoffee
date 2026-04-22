import coffeeImg from "@/assets/coffee.jpg";
import teaImg from "@/assets/tea.jpg";
import breakfastImg from "@/assets/breakfast.jpg";
import lunchImg from "@/assets/lunch.jpg";
import dessertsImg from "@/assets/desserts.jpg";
import drinksImg from "@/assets/drinks.jpg";
import snacksImg from "@/assets/snacks.jpg";

export interface MenuItem {
  name: string;
  price: number;
}
export interface MenuCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "coffee",
    icon: "☕",
    title: "Coffee & Hot Drinks",
    description: "Single-origin espresso and signature coffee creations.",
    image: coffeeImg,
    items: [
      { name: "Espresso", price: 4 },
      { name: "Double Espresso", price: 6 },
      { name: "Cappuccino", price: 7 },
      { name: "Latte", price: 7.5 },
      { name: "Café Crème", price: 7 },
      { name: "Americano", price: 6 },
      { name: "Mocha", price: 8.5 },
      { name: "Turkish Coffee", price: 6 },
    ],
  },
  {
    id: "tea",
    icon: "🍵",
    title: "Tea & Infusions",
    description: "Hand-picked leaves and Mediterranean herbs.",
    image: teaImg,
    items: [
      { name: "Green Tea", price: 5 },
      { name: "Mint Tea", price: 5.5 },
      { name: "Herbal Infusion (Chamomile / Verbena)", price: 6 },
      { name: "Premium Tea Selection", price: 7 },
    ],
  },
  {
    id: "breakfast",
    icon: "🥐",
    title: "Breakfast & Brunch",
    description: "Mornings made memorable.",
    image: breakfastImg,
    items: [
      { name: "Continental Breakfast (Coffee + Juice + Croissant + Butter & Jam)", price: 15 },
      { name: "Tunisian Breakfast (Lablabi / Eggs + Bread + Tea)", price: 18 },
      { name: "Pancakes with Honey & Fruits", price: 14 },
      { name: "French Toast", price: 13 },
      { name: "Omelette (Cheese / Turkey / Veggies)", price: 12 },
      { name: "Avocado Toast", price: 16 },
    ],
  },
  {
    id: "lunch",
    icon: "🍔",
    title: "Lunch & Quick Bites",
    description: "Fresh, satisfying plates served all afternoon.",
    image: lunchImg,
    items: [
      { name: "Chicken Sandwich", price: 14 },
      { name: "Club Sandwich", price: 16 },
      { name: "Tuna Sandwich", price: 13 },
      { name: "Caesar Salad", price: 18 },
      { name: "Mixed Salad", price: 14 },
      { name: "Pasta (Chicken / Cream / Tomato)", price: 20 },
    ],
  },
  {
    id: "desserts",
    icon: "🍰",
    title: "Desserts",
    description: "House-made indulgences for the sweet hour.",
    image: dessertsImg,
    items: [
      { name: "Chocolate Cake", price: 9 },
      { name: "Cheesecake", price: 10 },
      { name: "Tiramisu", price: 10 },
      { name: "Fruit Salad", price: 8 },
      { name: "Ice Cream (per scoop)", price: 4 },
      { name: "Waffles with Chocolate", price: 12 },
    ],
  },
  {
    id: "drinks",
    icon: "🧃",
    title: "Fresh Drinks & Cold Beverages",
    description: "Cool refreshments squeezed and shaken to order.",
    image: drinksImg,
    items: [
      { name: "Fresh Orange Juice", price: 7 },
      { name: "Lemonade", price: 6 },
      { name: "Smoothies (Strawberry / Banana / Mixed)", price: 9 },
      { name: "Iced Coffee", price: 8 },
      { name: "Iced Latte", price: 8.5 },
      { name: "Soft Drinks", price: 4 },
      { name: "Mineral Water", price: 2.5 },
    ],
  },
  {
    id: "late-night",
    icon: "🌙",
    title: "Late Night Snacks",
    description: "After-dark cravings, perfectly crisp.",
    image: snacksImg,
    items: [
      { name: "Mini Pizza", price: 12 },
      { name: "Fries", price: 6 },
      { name: "Chicken Nuggets", price: 10 },
    ],
  },
];
