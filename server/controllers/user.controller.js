import User from "../models/user.model.js";

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      roles: user.roles,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
};

export const registerUser = async (req, res) => {
  const { username, name, email, password, roles } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
    roles,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      roles: user.roles,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};


export const logoutUser = async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout out" });
  };