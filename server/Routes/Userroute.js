import jwt  from 'jsonwebtoken';
import express from'express'
import User from "../Model/users.js";
import bcrypt from'bcrypt';
import cookie from 'cookie'
import { verifyTokenMiddleware } from '../Middleware/Middleware.js';
const Userrouter=new express.Router()






Userrouter.post("/register", async (req, res) => {
  const {
    fullName, emailAddress, password, confirmPassword, dateOfBirth,
    phoneNumber, address, city, state, zipCode, country, securityQuestion
  } = req.body;

  try {
    if (!fullName || !emailAddress || !password || !confirmPassword || !dateOfBirth || !phoneNumber || !address || !city || !state || !zipCode || !country || !securityQuestion) {
      return res.status(400).json({ error: "Please fill all the input fields" });
    }

    const existUser = await User.findOne({ emailAddress });
    if (existUser) {
      return res.status(422).json({ error: "Email is already registered" });
    } else if (password !== confirmPassword) {
      return res.status(422).json({ error: "Password and Confirm Password should match" });
    }

    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedconfimpass=await bcrypt.hash(confirmPassword,saltRounds)

    const data = new User({
      ...req.body,password:hashedPassword,confirmPassword:hashedconfimpass
    });

    await data.save();
    res.json({ msg: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* Userrouter.post("/login", async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const chekUser = await User.findOne({ emailAddress });

    if (!chekUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const compPass = await bcrypt.compare(password, chekUser.password);

    if (compPass) {
      // Generate a JWT token and set it as a cookie


      return res.status(201).json({ msg: "Log in done" });
    } else {
      return res.status(422).json({ error: "Username or Password does not match" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 */
// ...

Userrouter.post("/login", async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const user = await User.findOne({ emailAddress });
console.log(user)
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5MTE1NjAxNSwiaWF0IjoxNjkxMTU2MDE1fQ.AZZD1HTlQ1znIKMgDkDmS26Dft71HHlv7VXGuOTE32s', { expiresIn: '5m' }); // Expires in 5 minutes
      user.token=token
      await user.save();
      console.log(token)
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 300, // 5 minutes expiration (in seconds)
        sameSite: 'strict', 
        path: '/', 
      }));

      return res.status(201).json({ msg: "Log in done" });
    } else {
      return res.status(422).json({ error: "Username or Password does not match" });

    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error)
  }
  
});
Userrouter.get('/profile',verifyTokenMiddleware,(req,res)=>{
  
  const user = req.user;
  const {fullName,emailAddress,address,city,state,country,zipCode,securityQuestion,dateOfBirth,phoneNumber}=user

  res.json({fullName,emailAddress,address,city,state,country,zipCode,securityQuestion,dateOfBirth,phoneNumber})
})

  


export default Userrouter;