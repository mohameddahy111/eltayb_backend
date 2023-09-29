import multer  from 'multer'

export const  uploadCloud = ()=>{
  const storage =  multer.diskStorage({})
  const multerUpload = multer({storage})
  return multerUpload
}