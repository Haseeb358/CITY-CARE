// import {ratelimit} from 'express-rate-limit';
//  got this error:  The requested module 'express-rate-limit' does not provide an export named 'ratelimit'
import rateLimit from 'express-rate-limit';


const limiter = rateLimit({
    windowMs: 6 * 60 * 60 * 1000, // 6 hours
    max: 4, // limit each IP to 4 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 6 hours',
        success: false
    }
});

export default limiter;