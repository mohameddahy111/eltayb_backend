import { AppError } from "../utils/appError.js";

export function validetor(schema) {
  return (req, res, next) => {
    console.log('hiii')
    let data = {...req.body , ...req.query,  ...req.params }
    let { error } = schema.validate(data, { abortEarly: false });
    if (!error) {
      next();
    } else {
      next(new AppError(`${error.message}`, 400));
    }
  };
}
