import { body, validationResult } from "express-validator";

const loginChecks = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),
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

export async function loginValidator(req, res, next) {
  await Promise.all(loginChecks.map((check) => check.run(req)));

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
