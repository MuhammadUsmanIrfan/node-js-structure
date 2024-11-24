const errorHandler = (err, req, res, next) => {
  const statusCode = 500;
  // const statusCode = res.statusCode ? res.statusCode : 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
