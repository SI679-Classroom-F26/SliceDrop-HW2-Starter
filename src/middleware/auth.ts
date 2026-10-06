// GIVEN: your HW1 auth, unchanged. Two shared secrets, two middlewares, no
// users and no roles -- real authentication is still a few weeks away.
import { NextFunction, Request, Response } from "express";
import { CUSTOMER_TOKEN, STAFF_TOKEN } from "../constants";

/**
 * Pulls the token out of an `Authorization: Bearer <token>` header value.
 * Returns null when the header is missing or not in that form.
 */
export function parseBearerToken(header: string | undefined): string | null {
  if (header === undefined) {
    return null;
  }

  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;
  if (scheme !== "Bearer") {
    return null;
  }

  return token;
}

export function requireCustomerToken(req: Request, res: Response, next: NextFunction): void {
  const token = parseBearerToken(req.get("authorization"));

  if (token !== CUSTOMER_TOKEN) {
    res.status(401).json({ error: "A valid customer token is required." });
    return;
  }

  next();
}

export function requireStaffToken(req: Request, res: Response, next: NextFunction): void {
  const token = parseBearerToken(req.get("authorization"));

  if (token !== STAFF_TOKEN) {
    res.status(401).json({ error: "A valid staff token is required." });
    return;
  }

  next();
}
