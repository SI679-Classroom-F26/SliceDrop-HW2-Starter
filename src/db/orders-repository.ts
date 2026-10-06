// The orders data layer -- HW1's in-memory array, all grown up.
//
// The function names survive from HW1; every body changes. Two things are
// new everywhere:
//
//   1. Everything is async now. The array answered instantly; a database is
//      a network away.
//   2. Ids are Mongo ObjectIds. In responses they travel as 24-hex-character
//      strings: _id.toHexString() on the way out, new ObjectId(id) on the
//      way in. The validateId middleware guarantees any id reaching this
//      file is at least the right shape.
//
// The mapping between "stored document" (has _id) and "API Order" (has
// string id) happens HERE and nowhere else.
import { ObjectId } from "mongodb";
import { ORDERS_COLLECTION } from "../constants";
import { getDb } from "./db";
import { NewOrder, Order, OrderStatus } from "../models/order";

// TODO: addOrder -- build the document from newOrder plus:
//   status "pending", createdAt new Date().toISOString(), and the given
//   total. insertOne it, then return the Order -- insertedId becomes the
//   string id.
export async function addOrder(newOrder: NewOrder, total: number): Promise<Order> {
  throw new Error("TODO: addOrder");
}

// TODO: listOrders -- find all (or filter by status when given), newest
//   first is not required. Map each document to an Order.
export async function listOrders(status?: string): Promise<Order[]> {
  throw new Error("TODO: listOrders");
}

// TODO: getOrder -- findOne by ObjectId; undefined when nothing matches.
export async function getOrder(id: string): Promise<Order | undefined> {
  throw new Error("TODO: getOrder");
}

// TODO: updateOrderStatus -- findOneAndUpdate with $set and
//   { returnDocument: "after" }; return the updated Order, or undefined
//   when no order has that id. The controller has already checked the
//   status is a real one.
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  throw new Error("TODO: updateOrderStatus");
}

// GIVEN: test-only.
export async function _clearOrders(): Promise<void> {
  await getDb().collection(ORDERS_COLLECTION).deleteMany({});
}
