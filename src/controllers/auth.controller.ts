import express from 'express';
import jwt from 'jsonwebtoken';

// MIDDLEWARE TO PROTECT ROUTES
export async function protectRoute (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
    //1. Getting token and checking if it's there
    const authorizationHeader = req.headers.authorization as String;
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) { 
        return res.status(401).send({ message: 'Access token is missing' })
    }
    const token = authorizationHeader.split(' ')[1]

    if(!token) {
      return res.status(401).send({ message: 'Token not found'})
    }

    //2. Verification token

    try {
     jwt.verify(token, process.env.JWT_SECRET as string) 
 
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).send({ message: 'Token has expired' });
      } else {
        return res.status(401).send({ message: 'Invalid token. Please, login again' });
      }
    }


    /*
    //3. Check if user still exists
    try {
      const user = await UserModel.findOne({ accessToken: token})

      if (!user) {
        return res.status(400).send({ message: 'The user with this token no longer exists'})
      } else {
        next ()
      }
    } catch (error) {
      return res.status(500).send({ message: 'Database Error'})
    }

    */

     // If everything is fine, proceed to the next middleware or route handler
      next()
         
    } catch (error) {
      console.log(error)
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};


