import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  const token = jwt.sign({
      userId, role
    }, 
    process.env.TOKEN_SECRET, {
      expiresIn: '1h',
    }
  );
  
  return token;
};

export default generateToken;