const jwt = require("jsonwebtoken");
require("dotenv").config();



module.exports = (req, res, next) => {
 
  if (req.method === "OPTIONS") return next();

  try {
    // Bearer Token
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: error.message });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
