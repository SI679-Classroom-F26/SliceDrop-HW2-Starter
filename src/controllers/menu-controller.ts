// Menu CONTROLLERS: take what they need from the request, call the layers
// below, decide the status code. Named after the HTTP verbs they handle --
// the data-layer call inside speaks business language (findMenuItem,
// insertMenuItem), and importing that layer as a namespace keeps the two
// vocabularies from colliding: this file's deleteMenuItem handles the HTTP
// DELETE; menuRepository.deleteMenuItem removes the record.
// The HTTP world (req, res) ends in this file.
import { Request, Response } from "express";
import * as menuRepository from "../db/menu-repository";
import { validateMenuItem } from "../validation/validate-menu-item";

// GIVEN: the two reads, migrated from HW1's router handlers. Same behavior
// as HW1 -- category filtering, 404 on unknown id -- just async now, and
// living in the controllers layer.
export async function getMenu(req: Request, res: Response): Promise<void> {
  const category = req.query.category;

  if (typeof category === "string") {
    res.json(await menuRepository.getAllMenuItems(category));
    return;
  }

  res.json(await menuRepository.getAllMenuItems());
}

export async function getMenuItem(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const item = await menuRepository.findMenuItem(id);

  if (item === undefined) {
    res.status(404).json({ error: `No menu item with id "${id}".` });
    return;
  }

  res.json(item);
}

// TODO: postMenuItem -- POST /menu (staff).
//   Validate the body with validateMenuItem (full, not partial): 400 with
//   { errors } when invalid. Then check the id: if menuRepository.findMenuItem
//   already returns something, that id is taken -- respond 409 (Conflict),
//   a status code that exists for exactly this. Otherwise insert and
//   respond 201 with the new item.
export async function postMenuItem(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}

// TODO: patchMenuItem -- PATCH /menu/:id (staff).
//   A PATCH body is PARTIAL: only the provided fields change, so validate
//   with validateMenuItem(body, { partial: true }). 400 when invalid, 404
//   when no item has the id, otherwise 200 with the updated item. Don't let
//   a body smuggle in a different `id` -- that field is not updatable.
export async function patchMenuItem(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}

// TODO: deleteMenuItem -- DELETE /menu/:id (staff).
//   404 when no item has the id; on success respond 204 (No Content) --
//   res.status(204).end(), no body. 204 says "done, and there is nothing
//   to show you," which is exactly what a delete is.
export async function deleteMenuItem(req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: "TODO: not implemented yet." });
}
