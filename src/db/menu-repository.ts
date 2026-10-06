// The menu data layer. Nothing above this file knows Mongo exists.
//
// Menu ids are readable strings we chose ("hawaiian") stored as an ordinary
// `id` field -- Mongo's own _id also exists on each document but never leaves
// this file. Contrast with orders, where the Mongo _id IS the id.
import type { Filter } from "mongodb";
import { MENU_COLLECTION } from "../constants";
import { getDb } from "./db";
import { Category, MenuItem } from "../models/menu-item";

// GIVEN: the two reads the rest of the app already relies on.
// The projection strips Mongo's _id so a MenuItem comes back exactly as a
// MenuItem -- the shape in types.ts, nothing extra.
export async function getAllMenuItems(category?: string): Promise<MenuItem[]> {
  // The query is typed against MenuItem, but a query string from a URL is
  // just a string. The cast says: treat it as a Category and let an
  // impossible one match nothing -- which is exactly the HW1 behavior
  // (unknown category returns an empty array, not an error).
  const filter: Filter<MenuItem> = category === undefined ? {} : { category: category as Category };
  return getDb()
    .collection<MenuItem>(MENU_COLLECTION)
    .find(filter, { projection: { _id: 0 } })
    .toArray();
}

export async function findMenuItem(id: string): Promise<MenuItem | undefined> {
  const item = await getDb()
    .collection<MenuItem>(MENU_COLLECTION)
    .findOne({ id }, { projection: { _id: 0 } });
  return item ?? undefined;
}

// TODO: insertMenuItem -- insertOne. The controller has already checked
// the id isn't taken.
export async function insertMenuItem(item: MenuItem): Promise<void> {
  throw new Error("TODO: insertMenuItem");
}

// TODO: updateMenuItem -- $set only the provided fields, return the updated
// item (the same shape findMenuItem returns), or undefined when no item has
// that id. Look at findOneAndUpdate with { returnDocument: "after" } -- and
// remember the projection.
export async function updateMenuItem(id: string, changes: Partial<MenuItem>): Promise<MenuItem | undefined> {
  throw new Error("TODO: updateMenuItem");
}

// TODO: deleteMenuItem -- deleteOne; report whether anything was actually
// deleted (deletedCount tells you).
export async function deleteMenuItem(id: string): Promise<boolean> {
  throw new Error("TODO: deleteMenuItem");
}

// GIVEN: test-only, straight from the week 3 lecture. Functions starting
// with _ exist only for tests and are never called by application code.
export async function _clearMenuItems(): Promise<void> {
  await getDb().collection(MENU_COLLECTION).deleteMany({});
}
