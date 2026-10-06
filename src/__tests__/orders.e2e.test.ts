import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";
import { CUSTOMER_TOKEN, STAFF_TOKEN } from "../constants";
import { resetData, startTestDb, stopTestDb } from "./mongo-helper";

beforeAll(startTestDb);
afterAll(stopTestDb);
beforeEach(resetData);

const asCustomer = () => request(app).post("/orders").set("Authorization", `Bearer ${CUSTOMER_TOKEN}`);
const staffGet = (path: string) => request(app).get(path).set("Authorization", `Bearer ${STAFF_TOKEN}`);

// hawaiian large 15.99 + deep dish 2.00 + bacon 1.25 + feta 2.25 = 21.49
// soda 20 oz 1.99 x 2 = 3.98            => total 25.47
const ADA_ORDER = {
  customerName: "Ada",
  items: [
    { menuItemId: "hawaiian", quantity: 1, size: "large", crust: "deep dish", toppings: ["bacon", "feta"] },
    { menuItemId: "soda", quantity: 2, size: "20 oz" },
  ],
};

describe("POST /orders", () => {
  it("stores the order and answers 201 with it, including the total", async () => {
    const res = await asCustomer().send(ADA_ORDER);
    expect(res.status).toBe(201);
    expect(res.body.customerName).toBe("Ada");
    expect(res.body.status).toBe("pending");
    expect(res.body.id).toMatch(/^[0-9a-f]{24}$/); // a Mongo ObjectId, as a string
    expect(res.body.total).toBeCloseTo(25.47, 2);
  });

  it("prices flat items, free crusts, and quantities correctly", async () => {
    // build-your-own medium 11.99 + thin 0 + mushroom 1.25 = 13.24 x 1
    // chocolate chip cookie 4.99 x 2 = 9.98        => total 23.22
    const res = await asCustomer().send({
      customerName: "Grace",
      items: [
        { menuItemId: "build-your-own", quantity: 1, size: "medium", crust: "thin", toppings: ["mushroom"] },
        { menuItemId: "chocolate-chip-cookie", quantity: 2 },
      ],
    });
    expect(res.status).toBe(201);
    expect(res.body.total).toBeCloseTo(23.22, 2);
  });

  it("gives each order a distinct id", async () => {
    const first = await asCustomer().send(ADA_ORDER);
    const second = await asCustomer().send(ADA_ORDER);
    expect(first.body.id).not.toBe(second.body.id);
  });
});

describe("GET /orders", () => {
  it("is empty before anything is ordered", async () => {
    const res = await staffGet("/orders");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns the orders that were placed", async () => {
    await asCustomer().send(ADA_ORDER);
    await asCustomer().send({ customerName: "Grace", items: [{ menuItemId: "soda", quantity: 1, size: "20 oz" }] });
    const res = await staffGet("/orders");
    expect(res.body).toHaveLength(2);
  });

  it("filters by status", async () => {
    await asCustomer().send(ADA_ORDER);
    const pending = await staffGet("/orders?status=pending");
    expect(pending.body).toHaveLength(1);
    const completed = await staffGet("/orders?status=completed");
    expect(completed.body).toEqual([]);
  });
});

describe("GET /orders/:id", () => {
  it("lets staff fetch an order by id", async () => {
    const created = await asCustomer().send(ADA_ORDER);
    const res = await staffGet(`/orders/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.total).toBeCloseTo(25.47, 2);
  });

  it("404s a well-formed id that matches nothing", async () => {
    const res = await staffGet("/orders/aaaaaaaaaaaaaaaaaaaaaaaa");
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe("PATCH /orders/:id/status", () => {
  it("moves an order along and the change sticks", async () => {
    const created = await asCustomer().send(ADA_ORDER);

    const patched = await request(app)
      .patch(`/orders/${created.body.id}/status`)
      .set("Authorization", `Bearer ${STAFF_TOKEN}`)
      .send({ status: "in-progress" });
    expect(patched.status).toBe(200);
    expect(patched.body.status).toBe("in-progress");

    const read = await staffGet(`/orders/${created.body.id}`);
    expect(read.body.status).toBe("in-progress");
  });

  it("rejects a status that is not on the list", async () => {
    const created = await asCustomer().send(ADA_ORDER);
    const res = await request(app)
      .patch(`/orders/${created.body.id}/status`)
      .set("Authorization", `Bearer ${STAFF_TOKEN}`)
      .send({ status: "yeeted" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("404s a well-formed id that matches nothing", async () => {
    const res = await request(app)
      .patch("/orders/aaaaaaaaaaaaaaaaaaaaaaaa/status")
      .set("Authorization", `Bearer ${STAFF_TOKEN}`)
      .send({ status: "completed" });
    expect(res.status).toBe(404);
  });
});
