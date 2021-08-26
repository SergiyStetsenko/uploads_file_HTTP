const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const router = Router();
// /auth/signup
router.post(
  "/signup",
  [
    check("email", "Некорректные enail").isEmail(),
    check("password", "Некорректные паро").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные",
        });
      }
      const { email, password } = req.body;
      const isUser = await User.findOne({ email });
      if (isUser) {
        res.status(306).json({ message: "user already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        images: [gravatar.url(email, { s: 300, r: "pg", d: "mm" })],
      });
      await user.save();

      res.status(201).json({ message: "user add" });
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
);
router.post(
  "/signin",
  [
    check("email", "Некорректные данные").isEmail(),
    check("password", "Некорректные данные").exists(),
    // в логине мы указываем .exists что в логине что-то есть ,а не(.isLength({min:6})) как при регистрации
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `there is no user in ${email} the database` });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: `there is no user in the database` });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      return res.json({ token, userId: user.id });
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = router;
