import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  const token = jwt.sign({
      userId, role
    }, 
    process.env.TOKEN_SECRET, {
      expiresIn: '24h',
    }
  );
  
  return token;
};

export default generateToken;