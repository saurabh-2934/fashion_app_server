const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { where } = require("sequelize");
require("dotenv").config();

const createNewUser = async (request, response) => {
  try {
    const { name, email, password, mobile } = request.body;

    // 1. Check required fields
    if (!name || !email || !password || !mobile) {
      return response.status(400).json({
        error_msg: "All fields are required",
      });
    }

    // 2. Validate email
    if (!validator.isEmail(email)) {
      return response.status(400).json({
        error_msg: "Please enter a valid email",
      });
    }

    // 3. Check if email already exists
    const isEmailExists = await models.User.findOne({
      where: { email },
    });

    if (isEmailExists) {
      return response.status(400).json({
        error_msg: "Email already exists. Try a different email.",
      });
    }

    // 4. Hash password (IMPORTANT FIX)
    const hashedPass = await bcrypt.hash(password, 10);

    // 5. Create user
    await models.User.create({
      name,
      email,
      password: hashedPass,
      mobile: mobile,
    });

    return response.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return response.status(500).json({
      error_msg: error.message,
    });
  }
};

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        error_msg: "all feilds are required",
      });
    }

    if (!validator.isEmail(email)) {
      return response.status(400).json({
        error_msg: "enter valid email id",
      });
    }

    const isEmailExists = await models.User.findOne({
      where: { email },
    });

    if (!isEmailExists) {
      return response.status(400).json({ error_msg: "user does not exists" });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      isEmailExists.password
    );

    if (!isPasswordMatched) {
      return response.status(400).json({ error_msg: "Invalid Password" });
    }

    const paylod = {
      id: isEmailExists.id,
    };

    const jwtToken = jwt.sign(paylod, process.env.MY_SECRET);
    response.status(200).json({ message: "Login successful", jwtToken });
  } catch (e) {
    return response.status(500).json({ error_msg: e.message });
  }
};

const getTheUserAccountDetails = async (request, response) => {
  try {
    const { id } = request;

    const userDetails = await models.User.findByPk(id);
    if (userDetails) {
      return response.status(200).json({ data: userDetails });
    } else {
      return response.status(400).json({ error_msg: "user not exist" });
    }
  } catch (e) {
    return response.status(500).json({ error_msg: e.message });
  }
};

const getMemberShip = async (request, response) => {
  try {
    const { id } = request;
    const { primeType } = request.body;

    const userDetails = await models.User.findByPk(id);

    if (userDetails) {
      userDetails.update({
        prime_user: true,
        membership_type: primeType,
      });
      response.status(200).json({ message: "Enjoy yor membership" });
    } else {
      response.status(400).json({ error_msg: "user not found" });
    }
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

const uploadProfileImage = async (request, response) => {
  try {
    const { id } = request;

    // Cloudinary gives URL automatically
    const imageUrl = request.file ? request.file.path : null;

    await models.User.update(
      {
        profile_img: imageUrl,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((result) => {
        response.status(201).json({ data: result });
      })
      .catch((e) => {
        response.status(400).json({ error_msg: e.message });
      });
  } catch (e) {
    response.status(500).json({ error_msg: e.message });
  }
};

module.exports = {
  createNewUser: createNewUser,
  loginUser: loginUser,
  getTheUserAccountDetails: getTheUserAccountDetails,
  getMemberShip: getMemberShip,
  uploadProfileImage: uploadProfileImage,
};
