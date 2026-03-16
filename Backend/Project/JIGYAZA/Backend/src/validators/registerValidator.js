import { body, validationResult } from "express-validator";

const registerChecks = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters long"),
  body("email").trim().isEmail().withMessage("a valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];

export async function registerValidator(req, res, next) {
  await Promise.all(registerChecks.map((check) => check.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass validation errors to the global error handler
    const err = new Error("Validation failed");
    err.statusCode = 400;
    err.errors = errors.array();
    return next(err);
  }

  next();
}
