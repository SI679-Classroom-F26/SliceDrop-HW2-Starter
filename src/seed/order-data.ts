// GIVEN: two faux orders so a fresh dev database has something for Postman
// and Compass to look at. Totals are worked out by hand below -- your
// calculateOrderTotal must agree with this arithmetic.
import type { Order } from "../models/order";

// The stored document has no `id` field: Mongo supplies the _id, and the
// data layer turns it into the string `id` on the way out.
export type OrderSeed = Omit<Order, "id">;

export const ORDER_SEED: OrderSeed[] = [
  {
    customerName: "Ada",
    items: [
      // hawaiian large 15.99 + deep dish crust 2.00 + bacon 1.25 + feta 2.25
      //   = 21.49 x 1
      { menuItemId: "hawaiian", quantity: 1, size: "large", crust: "deep dish", toppings: ["bacon", "feta"] },
      // soda 20 oz 1.99 x 2 = 3.98
      { menuItemId: "soda", quantity: 2, size: "20 oz" },
    ],
    status: "pending",
    createdAt: "2026-09-28T17:05:00.000Z",
    total: 25.47,
  },
  {
    customerName: "Grace",
    items: [
      // mediterranean medium 14.99 x 1
      { menuItemId: "mediterranean", quantity: 1, size: "medium" },
      // chocolate chip cookie 4.99 x 2 = 9.98
      { menuItemId: "chocolate-chip-cookie", quantity: 2 },
    ],
    status: "completed",
    createdAt: "2026-09-28T16:20:00.000Z",
    total: 24.97,
  },
];
