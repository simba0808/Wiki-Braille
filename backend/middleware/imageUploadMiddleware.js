import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(req.body.blog !== undefined && req.body.blog == "blog") {
      cb(null, 'images/blogs/');
    } else {
      console.log(req.body.blog)
      cb(null, 'images/');
    }
  },
  filename: function(req, file, cb) {
    const timeStamp = new Date().toISOString().replace(/[-T:Z.]/g, '');
    cb(null, timeStamp+"-"+file.originalname);
  }
});

const imageUpload = multer({storage: storage});

export default imageUpload;