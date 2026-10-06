import { Router } from "express";
import {
  getOrder,
  getOrders,
  patchOrderStatus,
  postOrder,
} from "../controllers/orders-controller";
import { requireCustomerToken, requireStaffToken } from "../middleware/auth";
import { validateId } from "../middleware/validate-id";

// TODO: wire up the order routes:
//
//   POST  /             customer only  -> postOrder
//   GET   /             staff only     -> getOrders
//   GET   /:id          staff only     -> getOrder
//   PATCH /:id/status   staff only     -> patchOrderStatus
//
// The two /:id routes also take validateId in the chain, AFTER the token
// middleware: who-are-you comes before is-your-request-well-formed, same as
// HW1's auth-before-validation rule.
//
// (Why can't the customer who placed an order fetch it? Because with shared
// secrets, every customer is the same customer -- we have no identity to
// check an order against. Staff-only for now; real authentication fixes
// this properly in a few weeks.)

export const ordersRouter = Router();
