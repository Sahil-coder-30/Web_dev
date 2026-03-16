export function errorHandler(err, req, res, next) {
  // If the error already has a status code, use it, otherwise default to 500
  const status = err.statusCode || err.status || 500;

  const payload = {
    message: err.message || "Internal server error",
  };

  if (err.errors) {
    // express-validator errors can be passed here
    payload.errors = err.errors;
  }

  // Avoid leaking stack in production
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
