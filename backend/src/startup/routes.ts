import express from 'express';
import auth from '../routes/auth'



export default function initRoutes(app) {
    app.use('/auth', auth);
}


