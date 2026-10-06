import express, { NextFunction, Request, Response } from "express";
import { menuRouter } from "./routes/menu-router";
import { ordersRouter } from "./routes/orders-router";

export const app = express();

app.use(express.json());

app.use("/menu", menuRouter);
app.use("/orders", ordersRouter);

// Any request no router handled ends up here.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found." });
});

// Fall-through error handler. Express recognizes it by its four parameters,
// and sends it EVERY error -- not just the one we happen to be thinking about.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Request body is not valid JSON." });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});
