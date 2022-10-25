import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';
import FollowModel from '../models/Follow.js';

export const register = async (req, res) => {
    try{
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    });
    
    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
    }, 'password333',
    {
        expiresIn: '30d',
    },
    );

    const {passwordHash, ... userData} = user._doc;

    res.json({
        ... user._doc,
        token,
    });
}
catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'Error occured during registration'
    });
}
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user){
            return req.status(404).json({
                message: 'Invalid user',
            });
        }

        const PassValidation = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    
        if (!PassValidation){
            return req.status(404).json({
                message: 'Invalid login or password',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'password333',
        {
            expiresIn: '30d',
        },
        )

        const {passwordHash, ... userData} = user._doc;

        res.json({
            ... user._doc,
            token,
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
        message: 'Error occured during login'
    });
    };
};

export const me = async (req, res) => {
    try {
        
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: 'Invalid user'
            });
        }

        const {passwordHash, ... userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
        message: "No access"
    });
    }
};

export const follow = async (req, res) =>{
    try {
        const userId = req.userId;
        const followId = req.params.id;
      
  
        const doc = new FollowModel({
          user: userId,
          following: followId,
        });
        
  
        const follow = await doc.save();
  
        return res.json(follow);
      } catch (err) {
          console.log(err);
          res.status(500).json({
            message: 'Failed to follow user',
          });
      }
};

export const unfollow = async (req, res) => {
try {
    
    const followingId = req.params.id;

    
    FollowModel.findOneAndDelete(
        {
            _id: followingId,
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Failed to receive follow data',
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Follow link does not exist"
                });
            }
            res.json({
                success: true,
            });
        },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to receive follow data',
        });
    }
};