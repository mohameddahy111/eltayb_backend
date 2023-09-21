import  joi from 'joi';


 const adduserValidation  =joi.object({
  name: joi.string().min(2).required(),
  email:joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
  phone:joi.number().min(11).required()
}).options({allowUnknown : true});

 const loginValidation =joi.object({
  email:joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
}).options({allowUnknown : true});

export { loginValidation, adduserValidation}