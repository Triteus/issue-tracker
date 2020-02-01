import rateLimit from 'express-rate-limit';
import { Application } from 'express';

export default function (app: Application) {
    // needed for deployment
    app.set('trust proxy', 1);

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200
    });

    app.use("/api/", apiLimiter);
}