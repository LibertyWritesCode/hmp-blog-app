import express from 'express'; // Import express framework
import jwt from 'jsonwebtoken'; // Import JWT package

// Middleware to protect routes by verifying JWT tokens
export async function protectRoute (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // 1. Getting the token and checking if it's present
        const authorizationHeader = req.headers.authorization as string;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) { 
            return res.status(401).send({ message: 'Access token is missing' });
        }
        
      // Extract the token from the "Bearer" header
        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: 'Token not found' });
        }

      // 2. Verifying the token
        try {
            // Verify the token using the JWT_SECRET stored in environment variables
            jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) { // If error is an instance of TokenExpiredError
              // Token has expired
                return res.status(403).send({ message: 'Token has expired' });
            } else {
                // Invalid token, due to an issue with the secret key
                return res.status(401).send({ message: 'Invalid token. Please, login again' });
            }
        }

      // If everything is fine, proceed to the next middleware or route handler
        next();
    } catch (error) {
      // Handle any unexpected errors with a 500 status code response
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}
