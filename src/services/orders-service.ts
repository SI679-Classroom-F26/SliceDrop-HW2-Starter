// The orders SERVICE layer: business logic that is not HTTP (that's the
// controllers) and not database access (that's data/). Pricing is a business
// rule -- it belongs to the restaurant, not to Express and not to Mongo.
//
// You may notice the menu has no service layer at all: its controllers call
// data/menu directly, because the menu HAS no business logic yet, and a
// layer that only forwards calls is ceremony, not architecture. Not every
// resource needs every layer.
import { findMenuItem } from "../db/menu-repository";
import { addOrder } from "../db/orders-repository";
import { NewOrder, Order, OrderItem } from "../models/order";

/**
 * GIVEN: placing an order = pricing it + storing it. This function is the
 * whole reason the controller doesn't call the data layer itself.
 */
export async function placeOrder(newOrder: NewOrder): Promise<Order> {
  const total = await calculateOrderTotal(newOrder.items);
  return addOrder(newOrder, total);
}

// TODO: calculateOrderTotal -- HW1 said "payment math comes in a later
// phase." Welcome to the later phase. For each item:
//
//   base price:  the matching size's price when the item has sizes,
//                otherwise the item's flat `price`
//   + crust:     that crust's price (deep dish costs more; most are 0)
//   + toppings:  each chosen topping's price (regular and premium toppings
//                already carry different prices in the menu data)
//   sauce:       a sauce CHOICE costs nothing -- "comes with one sauce"
//   x quantity
//
// Sum every item, and round the final number to cents:
//   Math.round(sum * 100) / 100
// (Try 21.49 + 3.98 in the Node REPL without rounding and see why. Floating
// point is why real payment systems count integer cents; rounding at the
// end is our intro-course version of that.)
//
// Validation has already run by the time this is called, so every
// menuItemId, size, crust, and topping is known to exist -- you can look
// things up without re-checking them (findMenuItem is imported above). The
// seeded orders in src/seed/order-data.ts show the arithmetic worked out by
// hand; your function must agree with them.
export async function calculateOrderTotal(items: OrderItem[]): Promise<number> {
  throw new Error("TODO: calculateOrderTotal");
}
