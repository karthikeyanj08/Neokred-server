import User from "../Model/users.js";

const createUser = async (req,res) => {
  try {
    // Create a new User instance
    const user = new User(req.body);

    // Validate the user data (Mongoose schema validation)
    await user.validate();

    // Save the user to the database
    const savedUser = await user.save();
    res.status(201).json({'User created:':savedUser});

    return savedUser;
  } catch (error) {
    // If validation or saving fails, handle the error
    console.error('Error creating user:', error.message);
    throw error; // Rethrow the error for further handling
  }
};

export default createUser;