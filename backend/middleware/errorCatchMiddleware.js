const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if(err.name === "CastError" && err.kind === "ObjectId") {
    status = 404;
    message = "Resource Not Found";
  }
  
  res.status(status).json({
    message,
    stack: err.stack,
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export {
  notFoundHandler,
  errorHandler,
};