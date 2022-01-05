import path from "path";
import express from "express";
import multer from "multer";
import Cloudinary from "cloudinary";
const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: "mooc",
  api_key: "265854168759756",
  api_secret: "eSdb4VE70MLDyUXw3Pv9f7abuPY",
});

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const path = req.file.path;
    const result = await cloudinary.uploader.upload(path, {
      public_id: `profile/${uniqueFilename}`,
    });
    url = result.secure_url;
    return res.status(202).json(url);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

export default router;
