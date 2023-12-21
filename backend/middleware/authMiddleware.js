import jwt from "jsonwebtoken";

const authUserMiddleware = async (req, res, next) => {
  let token = req.headers['authorization'];
  if(token) {
    const isValid = token.match(/^Bearer\s+/) ? true: false;
    if (!isValid) {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      })
      res.status(401);
      throw new Error("Invalid token");
    }
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(err) {
        console.log(token)
        console.log(err.message)
        res.status(401);
        throw new Error("Invalid token");
      }
      req.decoded = decoded;
      next();
    })
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
  
};

const authAdminMiddleware = async (req, res, next) => {
  
};

export {
  authUserMiddleware,
  authAdminMiddleware,
};