import { NextFunction, Request, Response } from "express";

// GIVEN: order ids are Mongo ObjectIds rendered as 24 hex characters. A
// route param that is not even the right SHAPE ("badID123") is a malformed
// request -- 400 -- and it must never reach the database, where the mongodb
// driver would throw trying to build an ObjectId from it. An id that is the
// right shape but matches nothing is a different situation: 404, and that
// one IS the data layer's answer to give.
//
// (This is the week 3 lecture's "Now You Try" stretch, promoted to given
// code. Menu routes don't use it -- menu ids are strings we chose, like
// "hawaiian".)
const OBJECT_ID_SHAPE = /^[0-9a-f]{24}$/;

export function validateId(req: Request, res: Response, next: NextFunction): void {
  const id = String(req.params.id);

  if (!OBJECT_ID_SHAPE.test(id)) {
    res.status(400).json({ error: `"${id}" is not a valid order id.` });
    return;
  }

  next();
}
