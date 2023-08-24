const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
class AuthController {
  async login(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        msg: "Please enter both name & email",
      });
    }
    try {
      const isUser = await User.findOne({
        email: email,
      });
      if (isUser) {
        const token = jwt.sign({ _id: isUser._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        res.cookie("accessToken", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: true,
        });

        return res.status(200).json({
          success: true,
          msg: "logged in",
          user: isUser,
        });
      } else {
        // create user
        const user = await User.create({
          name,
          email,
        });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        res.cookie("accessToken", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: true,
        });

        return res.status(200).json({
          success: true,
          msg: "user created",
          user: user,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        msg: error.name + ": " + error.message,
      });
    }
  }

  async auth(req, res) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        msg: "token not found",
      });
    }

    const isVerified = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (isVerified) {
      return res.status(200).json({
        success: true,
        msg: "OK",
        isAuth: true,
      });
    }
  }
}

module.exports = new AuthController();
