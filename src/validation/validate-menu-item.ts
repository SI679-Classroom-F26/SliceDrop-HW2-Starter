import { VALID_STATUSES } from "../constants";

// TODO: validation for menu item bodies (POST /menu and PATCH /menu/:id).
// Same contract as validateOrder: a plain function, returns EVERY problem
// found, empty list means valid. No database access here -- whether an id
// is already taken is the controller's question (it answers 409); this
// file only judges the SHAPE of the body.
//
// The second argument handles the POST/PATCH difference:
//   validateMenuItem(body, { partial: false })  -- POST: id, name, and
//     category are required
//   validateMenuItem(body, { partial: true })   -- PATCH: everything is
//     optional; only judge the fields that are present
//
// A body is invalid if (when present, or when required and missing):
//   - id / name is not a non-empty string
//   - category is not one of the categories in types.ts
//   - price is not a number greater than 0
//   - sizes / toppings / crusts is not an array of { name: string,
//     price: number } objects (price >= 0 -- a free crust is real)
//   - sauces is not an array of strings
//
// (VALID_STATUSES is imported above as a nudge: the same
// "check membership in a known list" move works for categories. Build the
// list of valid categories yourself -- types disappear at runtime, so you
// cannot ask the Category type for its members. Worth thirty seconds of
// thought: why not?)
export function validateMenuItem(body: any, options: { partial: boolean }): string[] {
  return ["TODO: validateMenuItem is not written yet."];
}
