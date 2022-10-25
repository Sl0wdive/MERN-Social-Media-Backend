import { body } from 'express-validator'

export const register = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password less than 6 characters').isLength({ min: 5}),
    body('fullName', 'Enter your name').isLength({ min: 3}),
    body('avatarUrl', 'Invalid link').optional().isURL(),
];

export const login = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password less than 6 characters').isLength({ min: 5}),
];

export const postNew = [
    body('title', 'Enter your title').isLength({ min: 3}).isString(),
    body('text', 'Enter any text').isLength({ min: 3}).isString(),
    body('imageUrl', 'Invalid link').optional().isString(),
];

export const commentNew = [
    body('content', 'Enter any text').isLength({ min: 3}).isString(),
];