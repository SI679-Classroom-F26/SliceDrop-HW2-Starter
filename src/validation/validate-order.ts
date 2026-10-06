// Your HW1 validateOrder, with a problem: it no longer compiles.
//
// TODO: In HW1, findMenuItem answered instantly from an array. Now it asks
// a database, which means it returns a Promise -- and this file still
// treats it as a plain value. The refactor:
//
//   - validateOrder and validateOrderItem become async (their return types
//     change to Promise<...>; the controller already awaits validateOrder)
//   - the findMenuItem call gets an await
//   - offersCrust was written when a crust was a plain string; crusts are
//     { name, price } objects now (see types.ts), so it needs the same
//     shape as offersSize
//
// The RULES do not change at all. That is the point worth noticing: what
// makes an order valid has nothing to do with where the menu lives, but
// HOW we ask has changed, and async is contagious -- one Promise at the
// bottom ripples upward through every caller.
import { MenuItem } from "../models/menu-item";
import { findMenuItem } from "../db/menu-repository";

export function validateOrder(body: any): string[] {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return ["Request body must be a JSON object."];
  }

  if (typeof body.customerName !== "string" || body.customerName.trim() === "") {
    errors.push("customerName must be a non-empty string.");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array.");
    return errors;
  }

  for (let i = 0; i < body.items.length; i++) {
    validateOrderItem(body.items[i], i, errors);
  }

  return errors;
}

function validateOrderItem(item: any, index: number, errors: string[]): void {
  const label = `items[${index}]`;

  if (typeof item !== "object" || item === null) {
    errors.push(`${label} must be an object.`);
    return;
  }

  if (typeof item.menuItemId !== "string") {
    errors.push(`${label}.menuItemId must be a string.`);
    return;
  }

  const menuItem = findMenuItem(item.menuItemId);
  if (menuItem === undefined) {
    errors.push(`${label}: there is no menu item with id "${item.menuItemId}".`);
    return;
  }

  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    errors.push(`${label}.quantity must be a whole number of at least 1.`);
  }

  if (item.size !== undefined && !offersSize(menuItem, item.size)) {
    errors.push(`${label}: "${menuItem.name}" does not offer size "${item.size}".`);
  }

  if (item.crust !== undefined && !offersCrust(menuItem, item.crust)) {
    errors.push(`${label}: "${menuItem.name}" does not offer crust "${item.crust}".`);
  }

  if (item.sauce !== undefined && !offersSauce(menuItem, item.sauce)) {
    errors.push(`${label}: "${menuItem.name}" does not offer sauce "${item.sauce}".`);
  }

  if (item.toppings !== undefined) {
    if (!Array.isArray(item.toppings)) {
      errors.push(`${label}.toppings must be an array.`);
    } else {
      for (const topping of item.toppings) {
        if (!offersTopping(menuItem, topping)) {
          errors.push(`${label}: "${menuItem.name}" does not offer topping "${topping}".`);
        }
      }
    }
  }
}

function offersSize(menuItem: MenuItem, size: string): boolean {
  if (menuItem.sizes === undefined) {
    return false;
  }
  return menuItem.sizes.some((option) => option.name === size);
}

function offersCrust(menuItem: MenuItem, crust: string): boolean {
  if (menuItem.crusts === undefined) {
    return false;
  }
  return menuItem.crusts.includes(crust);
}

function offersSauce(menuItem: MenuItem, sauce: string): boolean {
  if (menuItem.sauces === undefined) {
    return false;
  }
  return menuItem.sauces.includes(sauce);
}

function offersTopping(menuItem: MenuItem, topping: string): boolean {
  if (menuItem.toppings === undefined) {
    return false;
  }
  return menuItem.toppings.some((option) => option.name === topping);
}
