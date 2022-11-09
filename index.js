import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

import * as validation from './validations/Validation.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import chauth from './utils/chauth.js';
import { PostControler, UserControler, CommentControler, ChatControler } from './controlers/index.js';

mongoose.connect('mongodb+srv://admin:qwerty123456@cluster0.2tucftx.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB OK'))
.catch((err) => console.log('DB ERROR', err));

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads'))
        {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());

app.post('/login', validation.login, handleValidationErrors, UserControler.login);
app.post('/register', validation.register, handleValidationErrors, UserControler.register);
app.get('/me', chauth, UserControler.me);

app.post('/upload', chauth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostControler.getAll);
app.get('/:id', PostControler.getOne);
app.post('/',chauth , validation.postNew,handleValidationErrors, PostControler.create);
app.delete('/:id', chauth, PostControler.remove);
app.patch('/:id', chauth, validation.postNew, handleValidationErrors, PostControler.update);


//app.get('/', chauth, PostControler.getMy); поки не потрібен


app.post('/posts/:id', chauth, validation.commentNew, handleValidationErrors, CommentControler.create);
app.get('/posts/:id', CommentControler.getAll);
//app.get('/posts/:id', PostControler.getOne); поки не потрібен
app.patch('/posts/:id', validation.commentNew, handleValidationErrors, CommentControler.update);
app.delete('/posts/:id/:id2', CommentControler.remove);

app.post('/like/:id', chauth, PostControler.like);
app.delete('/like/:id/:id2', PostControler.removeLike);

app.post('/follow/:id', chauth, UserControler.follow);
app.delete('/follow/:id', chauth, UserControler.unfollow);

app.post('/message/:id', chauth, ChatControler.sendMessage);
app.get('/message/:id',validation.messagetNew,handleValidationErrors , ChatControler.getMessages);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});
