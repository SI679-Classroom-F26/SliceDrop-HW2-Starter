// The menu item model: the shapes the whole app agrees on for menu data.
//
// TODO: The Phase 2 menu (src/seed/menu-data.ts) needs more than these types
// can describe, and `npm run typecheck` will point at that file until you fix
// it HERE. The menu now has:
//
//   1. desserts -- a category these types have never heard of.
//   2. crusts that COST MONEY (Deep Dish is +$2.00). A crust used to be just
//      a name (string), and now it is a name and a price -- the same shape a
//      topping already has. Define a CrustOption and change the `crusts`
//      field to use it.
//
// Do not touch seed/menu-data.ts -- it is correct. Make the model describe it.

export type Category = "pizza" | "appetizer" | "side" | "beverage";

export interface SizeOption {
  name: string;
  price: number;
}

export interface ToppingOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description?: string;
  /** Flat price, for items that do not come in sizes. */
  price?: number;
  /** The option lists below are present only when they apply to the item. */
  sizes?: SizeOption[];
  crusts?: string[];
  sauces?: string[];
  toppings?: ToppingOption[];
}

