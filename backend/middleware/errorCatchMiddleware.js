const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  console.log('>>>>>>>>>>>>')
  if(err.name === "CastError" && err.kind === "ObjectId") {
    status = 404;
    message = "Resource Not Found";
  }
  console.log(status, message)
  res.status(status).json({
    message,
    stack: err.stack,
  });
};

const notFoundHandler = (req, res, next) => {
  console.log(1);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export {
  notFoundHandler,
  errorHandler,
};