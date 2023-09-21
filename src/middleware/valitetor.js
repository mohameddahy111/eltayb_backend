import { AppError } from "../utils/appError.js";

export function validetor(schema) {
  return (req, res, next) => {
    const data = { ...req.body, ...res.query, ...req.params };
    let { errore } = schema.validate(data, { abortEarly: false });
    if (!errore) {
      next();
    } else {
      next(new AppError(`${errore.message}`, 400));
    }
  };
}
