const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts per 15 minutes
    'Too many authentication attempts, please try again later'
);

const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per 15 minutes
    'Too many requests, please try again later'
);

const jobLimiter = createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // 10 job posts per hour
    'Too many job postings, please try again later'
);

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://thayourjobfinderapp.netlify.app"],
        },
    },
    crossOriginEmbedderPolicy: false
});

// MongoDB sanitization middleware
const sanitizeMongo = mongoSanitize();

// XSS protection middleware
const sanitizeXSS = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
};

// Request size limiter
const requestSizeLimit = (req, res, next) => {
    const contentLength = req.get('content-length');
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength && parseInt(contentLength) > maxSize) {
        return res.status(413).json({
            success: false,
            message: 'Request entity too large'
        });
    }
    
    next();
};

// API key validation for sensitive operations
const validateApiKey = (req, res, next) => {
    const apiKey = req.get('X-API-Key');
    const validApiKey = process.env.API_KEY;
    
    if (!validApiKey) {
        return next(); // Skip validation if no API key is configured
    }
    
    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }
    
    next();
};

module.exports = {
    authLimiter,
    generalLimiter,
    jobLimiter,
    securityHeaders,
    sanitizeMongo,
    sanitizeXSS,
    requestSizeLimit,
    validateApiKey
};
