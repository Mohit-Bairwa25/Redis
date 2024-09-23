import {redis} from "../app.js";

export const getCachedData = (key) => async (req, res, next) => {
    let data = await redis.get(key);

    if (data)
        return res.json({
            products: JSON.parse(data),
        });

    next();
};

export const rateLimiter = (limit, timer) => async (req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const key = `${clientIp}:request_count`;
    const requestCount = await redis.incr(key);
    console.log(clientIp);

    if (requestCount === 1) {
       await redis.expire(key, timer);
    }

    const timeRemaining = await redis.ttl(key);

    if (requestCount > limit) {
        return res.status(429).send(`Too Many Request, Try Again after ${timeRemaining} seconds`);
    }
    req.requestCount = requestCount;

    next();
};