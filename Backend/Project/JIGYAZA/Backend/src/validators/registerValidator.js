import { body, validationResult } from "express-validator";

const registerChecks = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters long"),
  body("email").trim().isEmail().withMessage("a valid email is required"),
  body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isString()
  .isLength({ min: 8, max: 128 })
  .withMessage("Password must be between 8 and 128 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  ),
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
