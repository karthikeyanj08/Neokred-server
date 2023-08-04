// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from "../Model/users.js"
const SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5MTE1NjAxNSwiaWF0IjoxNjkxMTU2MDE1fQ.AZZD1HTlQ1znIKMgDkDmS26Dft71HHlv7VXGuOTE32s'


export function verifyTokenMiddleware(req, res, next) {
    console.log(req.cookies)
  const token = req.cookies.token||null; // Assuming the token is stored in a cookie named "token"

  
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    try {
      // Fetch the user from the database based on the email from the decoded token
      const user = await User.findOne({ email: decodedToken.email });

      if (!user) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      // Attach the user object to the request for future use
      req.user = user;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  });
}