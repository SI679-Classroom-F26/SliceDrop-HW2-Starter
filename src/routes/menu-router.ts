import { Router } from "express";
import {
  deleteMenuItem,
  getMenu,
  getMenuItem,
  patchMenuItem,
  postMenuItem,
} from "../controllers/menu-controller";
import { requireStaffToken } from "../middleware/auth";

// Routes are the thinnest layer in the app: which path, which method, which
// middleware, which controller. No logic. If a route handler has a body,
// something is in the wrong place.
//
// TODO: wire up the menu routes:
//
//   GET    /            open to everyone     -> getMenu
//   GET    /:id         open to everyone     -> getMenuItem
//   POST   /            staff only           -> postMenuItem
//   PATCH  /:id         staff only           -> patchMenuItem
//   DELETE /:id         staff only           -> deleteMenuItem
//
// "Staff only" means requireStaffToken sits in the chain before the
// controller. Ask yourself why GET / and POST / can share a path without
// colliding.

export const menuRouter = Router();
