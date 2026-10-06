// GIVEN: idempotent seeding. Each function checks its collection first and
// inserts only when it finds nothing, so restarting the server never
// duplicates data. The two collections are separate on purpose: the tests
// seed the menu but want orders to start empty.
import { MENU_COLLECTION, ORDERS_COLLECTION } from "../constants";
import { getDb } from "../db/db";
import { MENU_SEED } from "./menu-data";
import { ORDER_SEED } from "./order-data";

export async function seedMenuIfEmpty(): Promise<void> {
  const menu = getDb().collection(MENU_COLLECTION);
  if ((await menu.countDocuments()) === 0) {
    await menu.insertMany(MENU_SEED);
  }
}

export async function seedOrdersIfEmpty(): Promise<void> {
  const orders = getDb().collection(ORDERS_COLLECTION);
  if ((await orders.countDocuments()) === 0) {
    await orders.insertMany(ORDER_SEED);
  }
}
