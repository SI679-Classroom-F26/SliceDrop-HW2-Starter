// In a real application, secrets and connection strings come from
// configuration (environment variables), never from source code.
// We will get there later in the course.
export const CUSTOMER_TOKEN = "slicedrop-customer-secret";
export const STAFF_TOKEN = "slicedrop-staff-secret";

export const PORT = 3000;

export const MONGO_URI = "mongodb://127.0.0.1:27017";
export const DB_NAME = "slicedrop";

export const MENU_COLLECTION = "menu";
export const ORDERS_COLLECTION = "orders";

// Every status an order can hold. PATCH /orders/:id/status must reject
// anything not on this list.
import type { OrderStatus } from "./models/order";
export const VALID_STATUSES: OrderStatus[] = ["pending", "cancelled", "in-progress", "completed"];
