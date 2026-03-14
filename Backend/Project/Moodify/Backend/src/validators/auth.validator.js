import { body, validationResult } from "express-validator";
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log potential security issues (e.g., repeated failed validations)
    const errorMessages = errors.array().map((err) => err.msg);
    console.warn(
      `Validation failed for ${req.method} ${req.path}:`,
      errorMessages,
    );

    // Return sanitized error response
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};
// High-security register validation with sanitization and strong checks
export const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must contain only letters, numbers, and underscores")
    .notEmpty()
    .withMessage("Username is required")
    .escape(),

  body("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 254 }) // RFC 5321 limit
    .withMessage("Email is too long"),

  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol",
    )
    .notEmpty()
    .withMessage("Password is required"),

  validateRequest,
];

// High-security login validation
export const loginValidation = [
  body("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage("Please provide a valid email address")
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty"),

  validateRequest,
];

// Enhanced error handling middleware with security logging
