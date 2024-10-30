import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET);
};

// route for user login
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
         return res.json({ success: false, message: "User does't exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
         const token = createToken(user._id);
         res.json({ success: true, token });
      } else {
         res.json({ success: false, message: "Invalid credentials" });
      }
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// route for user registration
const registerUser = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      // check user  already exits or not
      const exists = await userModel.findOne({ email });
      if (exists) {
         return res.json({ success: true, message: "User already registered" });
      }

      // validate email format & strong password
      if (!validator.isEmail(email)) {
         return res.json({
            success: false,
            message: "Please enter a valid email",
         });
      }

      if (password.length < 8) {
         return res.json({
            success: false,
            message: "Please enter a strong password",
         });
      }

      // hash user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create new user object
      const user = new userModel({
         name,
         email,
         password: hashedPassword,
      });
      await user.save();
      const token = createToken(user._id);

      res.json({
         success: true,
         message: "User registered successfully",
         token,
      });
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// route for admin login
const adminLogin = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (
         email === process.env.ADMIN_EMAIL &&
         password === process.env.ADMIN_PASSWORD
      ) {
         const token = jwt.sign(email + password, process.env.JWT_SECRET);
         res.json({
            success: true,
            token,
         });
      } else {
         res.json({
            success: false,
            message: "Invalid credentials",
         });
      }
   } catch (error) {
      console.log(error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

export { loginUser, registerUser, adminLogin };
