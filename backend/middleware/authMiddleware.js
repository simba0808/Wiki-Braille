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
  let token = req.headers['authorization'];
  if(token) {
    const isValid = token.match(/^Bearer\s+/) ? true : false;
    if(!isValid) {
      // res.status(401).json({
      //   success: false,
      //   message: "Invalid token"
      // });
      res.status(401);
      throw new Error("Invalid token");
    }
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(err) {
        res.status(401);
        throw new Error("Invalid token");
      }
      if(decoded.role === 2) {
        next();
      } else {
        res.status(401);
        throw new Error("You have no Admin Permission")
      }
    });
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
};

export {
  authUserMiddleware,
  authAdminMiddleware,
};