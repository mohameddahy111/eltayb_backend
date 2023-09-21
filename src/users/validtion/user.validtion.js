import  joi from 'joi';


export const adduserValidation  =joi.object({
  name: joi.string().min(2).required(),
  email:joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
  phone:joi.number().min(11).max(13).required()
}).options({allowUnknown : true});

export const loginValidation =joi.object({
  email:joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
}).options({allowUnknown : true});
