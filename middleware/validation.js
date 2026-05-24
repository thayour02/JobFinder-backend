const { body, validationResult } = require('express-validator');

// User registration validation
const validateUserRegistration = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    
    body('LastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Company registration validation
const validateCompanyRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s&.-]+$/)
        .withMessage('Company name can only contain letters, numbers, spaces, and basic punctuation'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
    
    body('contact')
        .trim()
        .isLength({ min: 10, max: 20 })
        .withMessage('Contact number must be between 10 and 20 characters')
        .matches(/^[+]?[\d\s-()]+$/)
        .withMessage('Please provide a valid contact number')
];

// Login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Job posting validation
const validateJobPosting = [
    body('jobTitle')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Job title must be between 3 and 100 characters'),
    
    body('jobType')
        .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'])
        .withMessage('Invalid job type'),
    
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
    
    body('salary')
        .isNumeric()
        .withMessage('Salary must be a number'),
    
    body('vacancy')
        .isInt({ min: 1 })
        .withMessage('Vacancy must be at least 1'),
    
    body('experience')
        .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director'])
        .withMessage('Invalid experience level'),
    
    body('desc')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Job description must be between 10 and 2000 characters'),
    
    body('requirement')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Requirements must be between 10 and 2000 characters')
];

// Password reset validation
const validatePasswordReset = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Email validation for password reset
const validateEmailRequest = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateCompanyRegistration,
    validateLogin,
    validateJobPosting,
    validatePasswordReset,
    validateEmailRequest,
    handleValidationErrors
};
