import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";
import { CUSTOMER_TOKEN, STAFF_TOKEN } from "../constants";
import { resetData, startTestDb, stopTestDb } from "./mongo-helper";

beforeAll(startTestDb);
afterAll(stopTestDb);
beforeEach(resetData);

const ORDER = { customerName: "Ada", items: [{ menuItemId: "soda", quantity: 1, size: "20 oz" }] };

describe("open routes stay open", () => {
  it("GET /menu needs no token", async () => {
    const res = await request(app).get("/menu");
    expect(res.status).toBe(200);
  });
});

describe("customer-only: POST /orders", () => {
  it("rejects no token", async () => {
    expect((await request(app).post("/orders").send(ORDER)).status).toBe(401);
  });

  it("rejects an unrecognized token", async () => {
    const res = await request(app).post("/orders").set("Authorization", "Bearer nope").send(ORDER);
    expect(res.status).toBe(401);
  });

  it("rejects the staff token -- the two tokens are not ranked", async () => {
    const res = await request(app).post("/orders").set("Authorization", `Bearer ${STAFF_TOKEN}`).send(ORDER);
    expect(res.status).toBe(401);
  });

  it("accepts the customer token", async () => {
    const res = await request(app).post("/orders").set("Authorization", `Bearer ${CUSTOMER_TOKEN}`).send(ORDER);
    expect(res.status).toBe(201);
  });
});

describe("staff-only: order reads, status updates, menu writes", () => {
  it("GET /orders rejects the customer token", async () => {
    const res = await request(app).get("/orders").set("Authorization", `Bearer ${CUSTOMER_TOKEN}`);
    expect(res.status).toBe(401);
  });

  it("GET /orders/:id rejects the customer token too", async () => {
    const created = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${CUSTOMER_TOKEN}`)
      .send(ORDER);

    const res = await request(app)
      .get(`/orders/${created.body.id}`)
      .set("Authorization", `Bearer ${CUSTOMER_TOKEN}`);
    expect(res.status).toBe(401);
  });

  it("POST /menu rejects no token and the customer token alike", async () => {
    expect((await request(app).post("/menu").send({ id: "x", name: "X", category: "side", price: 1 })).status).toBe(401);
    const asCustomer = await request(app)
      .post("/menu")
      .set("Authorization", `Bearer ${CUSTOMER_TOKEN}`)
      .send({ id: "x", name: "X", category: "side", price: 1 });
    expect(asCustomer.status).toBe(401);
  });
});

describe("auth runs before everything else about the request", () => {
  it("answers 401, not 400, for a bad body with no token", async () => {
    const res = await request(app).post("/orders").send({});
    expect(res.status).toBe(401);
  });

  it("answers 401, not 400, for a malformed order id with no token", async () => {
    // requireStaffToken sits before validateId in the chain: who-are-you
    // comes before is-your-request-well-formed.
    const res = await request(app).get("/orders/badID123");
    expect(res.status).toBe(401);
  });
});
