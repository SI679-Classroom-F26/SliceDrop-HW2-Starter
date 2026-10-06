// GIVEN: shared test plumbing. Each suite runs against its own throwaway
// in-memory Mongo (see the week 3 notes on MongoMemoryServer): started in
// beforeAll, stopped in afterAll, and between tests the orders are wiped
// and the menu is re-seeded so no test can lean on another's leftovers.
// This file is not a test -- vitest only picks up *.test.ts.
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "../db/db";
import { _clearMenuItems } from "../db/menu-repository";
import { _clearOrders } from "../db/orders-repository";
import { seedMenuIfEmpty } from "../seed/seed";

let mongo: MongoMemoryServer | undefined;

export async function startTestDb(): Promise<void> {
  mongo = await MongoMemoryServer.create();
  await connect(mongo.getUri(), "test");
}

export async function stopTestDb(): Promise<void> {
  await disconnect();
  if (mongo !== undefined) {
    await mongo.stop();
  }
}

// Orders start empty; the menu starts seeded. Exactly what a fresh
// restaurant looks like.
export async function resetData(): Promise<void> {
  await _clearOrders();
  await _clearMenuItems();
  await seedMenuIfEmpty();
}
