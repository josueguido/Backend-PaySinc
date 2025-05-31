import CustomError from "../errors/CustomError.js";

const notFound = (req, res, next) => {
  next(new CustomError(`Route not found: ${req.originalUrl}`, 404));
};

export default notFound;
