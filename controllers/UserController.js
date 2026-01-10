const Usermodel = require("../model/Usermodel");
const Busmodel = require("../model/Busmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
  const { username, phone_no, password } = req.body;

  try {
    if (!username || !phone_no || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (phone_no.toString().length !== 10) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    const lowerUsername = username.toLowerCase();

    const existingUser = await Usermodel.findOne({
      $or: [{ username: lowerUsername }, { phone_no }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Usermodel({
      username: lowerUsername,
      phone_no,
      password: hashedPassword,
      role: "user"
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.LoginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usermodel.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
      // phone: user.phone_no
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CHECK USERNAME
exports.checkUsernameAvailability = async (req, res) => {
  const user = await Usermodel.findOne({
    username: req.params.username.toLowerCase()
  });
  res.json({ available: !user });
};

 