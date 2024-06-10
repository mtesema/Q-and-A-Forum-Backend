
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) =>{

  const authHeader = req.headers.authorization
 console.log("Authorization Header:", authHeader);


  if(!authHeader || !authHeader.startsWith('Bearer')){
    return res
    .status(StatusCodes.UNAUTHORIZED)
    .json({message:"No token provided"})
  }

  const token = authHeader.split(' ')[1]
  console.log("The token is >>>", token)

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token is>>>", decodedToken);

    // Ensure to use the correct properties from the decoded token
    const { userName, userID } = decodedToken; 
    if (!userName || !userID) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid token payload" });
    }

    // Assign the values to req.user
    req.user = { userName, userID };

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({message:'invalid authentication'})    
  }
}

module.exports = authentication