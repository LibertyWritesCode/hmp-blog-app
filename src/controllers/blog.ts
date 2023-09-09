import express from 'express';

const createPost = async (req: express.Request, res: express.Response) {
    const {title, content, author} = req.body;
    if (!title || !author) {
        return res.status(400).send({ message: 'Title and author are required' });
    }
    if (title.length < 15 || title.length > 50) {
        return res.status(400).send({ message: 'Title must be between 15 and 50 characters'});
    }
}
  
