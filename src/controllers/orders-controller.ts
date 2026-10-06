// Order CONTROLLERS. Same rules as the menu controllers: pull data from the
// request, call downward, choose the status code. Note what these do NOT
// do: no pricing (services), no Mongo (data), no field checking
// (validation). If you find yourself writing any of those here, it is in
// the wrong layer.
import { Request, Response } from "express";
import { VALID_STATUSES } from "../constants";
import * as ordersRepository from "../db/orders-repository";
import { placeOrder } from "../services/orders-service";
import { OrderStatus } from "../models/order";
import { validateOrder } from "../validation/validate-order";

// TODO: postOrder -- POST /orders (customer).
//   validateOrder is async now -- await it. 400 with { errors } when
//   invalid; otherwise hand the body to placeOrder (the service does the
//   pricing and storing) and respond 201 with the stored order. Note the
//   response now includes `total` -- the front end shows it on the
//   confirmation screen.
export async function postOrder(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}

// TODO: getOrders -- GET /orders (staff). Same contract as HW1: everything,
//   or ?status= filtered.
export async function getOrders(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}

// TODO: getOrder -- GET /orders/:id (staff). 404 when no order has that id.
//   validateId has already turned away malformed ids before this runs.
//   (ordersRepository.getOrder fetches the record; this getOrder handles
//   the HTTP GET -- the namespace import keeps the two names apart.)
export async function getOrder(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}

// TODO: patchOrderStatus -- PATCH /orders/:id/status (staff).
//   The body is { "status": "..." }. Reject anything not in VALID_STATUSES
//   with a 400 naming the valid ones. 404 when no order has the id.
//   Otherwise 200 with the updated order. (A TypeScript wrinkle: after you
//   have CHECKED the string is one of the valid statuses, giving the type `as OrderStatus`
//   -- is honest, because you verified it.)
//   if you're unfamiliar with the Typescript "as" keyword, you can learn about
//   it at https://www.w3schools.com/typescript/typescript_casting.php
export async function patchOrderStatus(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}
