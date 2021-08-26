const { Router } = require("express");
const { menuServise } = require("./UserServise");
const Jimp = require("jimp");
const multer = require("multer");
const uuid = require("uuid");
const { extname } = require("path");
const { promises: FsPromises } = require("fs");
const auth = require("../middlewere/auth.middleware");
const User = require("../models/User");

const router = Router();

const TMP_FILES_DIR_NAME = "draft";
const FILES_DIR_NAME = "public/images";

const upload = multer({
  storage: multer.diskStorage({
    destination: TMP_FILES_DIR_NAME,
    filename: (req, file, cb) => {
      const filename = uuid.v4() + extname(file.originalname);
      cb(null, filename);
    },
  }),
});

async function compressImage(req, res, next) {
  const file = await Jimp.read(req.file.path);
  const filePath = req.file.path.replace(TMP_FILES_DIR_NAME, FILES_DIR_NAME);
  await file.resize(250, 250).quality(70).writeAsync(filePath);

  await FsPromises.unlink(req.file.path);

  req.file.destination = req.file.destination.replace(
    TMP_FILES_DIR_NAME,
    FILES_DIR_NAME
  );

  req.file.path = filePath;
  console.log(filePath);
  next();
}

router.patch(
  "/info",
  auth,
  upload.single("images"),
  compressImage,

  async (req, res) => {
    const useImg = await menuServise.updateImages(req);
    return res.status(200).send(useImg);
  }
);

router.post("/logout", auth, async (req, res) => {
  await menuServise.logout(req.user);
  return res.status(200).send("user is logout");
});

module.exports = router;
