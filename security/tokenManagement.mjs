import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {

    // Read the JWT access token from the authorization header
    const accessToken = (req.headers && req.headers.authorization) && req.headers.authorization.replace("Bearer ", "");
  
    jwt.verify(
      accessToken,
      process.env.USERFRONT_PUBLIC_KEY,
      { algorithms: ["RS256"] }, async (err, auth) => {
        if (err) {
          res.send("Error verifying").status(403);
        } else {
          next();     
        } 
      }
    );
  }

  export function authenticateTokenAdmin(req, res, next) {

    // Read the JWT access token from the authorization header
    const accessToken = (req.headers && req.headers.authorization) && req.headers.authorization.replace("Bearer ", "");
  
    jwt.verify(
      accessToken,
      process.env.USERFRONT_PUBLIC_KEY,
      { algorithms: ["RS256"] }, async (err, auth) => {
        if (err) {
          res.send("Error verifying").status(403);
        } else {
          const roles = auth.authorization[process.env.USERFRONT_PROJECT_ID].roles;
          if (!roles.includes("admin")) {
            res.send("Unauthorized").status(401);
          } else {
            next();
          }
        } 
      }
    );
  } 