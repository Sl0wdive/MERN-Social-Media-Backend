import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        
      const postId = req.params.id;
    

      const doc = new CommentModel({
        content: req.body.content,
        post: postId,
        commenter: req.userId,
      });
      

      await PostModel.findOneAndUpdate(
        {
          id: postId,
        },
        {
          $inc: { commentCount: 1 },
        },
      );
      

      const comment = await doc.save();

      return res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Failed to create new comment',
        });
    }
};

export const getAll = async (req, res) => {
  try {
      
    const postId = req.params.id;
    const post = await PostModel.findById(postId);

    const comments = await CommentModel.find({ post: postId })
      .populate("commenter")
      .sort("-createdAt");
    return res.json(comments);
  }
  catch(err)
  {
    return res.status(400).json(err.message);
  }
};

export const remove = async (req, res) => {
  try {
  const commentId = req.params.id;
  const postId  = req.params.id2;


  const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment does not exist"
      });
    }
    else{
      await PostModel.findOneAndUpdate(
        {
          id: postId,
        },
        {
          $inc: { commentCount: -1 },
        },
        );
    };

  if(CommentModel.findOne({_id: commentId,})){};

  CommentModel.findOneAndDelete(
    {
      _id: commentId,
    },
    (err, doc) => {
      if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Failed to receive comment',
          });
        }
  
        if (!doc) {
          return res.status(404).json({
            message: "Comment does not exist"
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
      message: 'Failed to receive comment',
    });
  }
  
  
};
  
  export const update = async (req, res) => {
  try {
    const commentId = req.params.id;
  
    await CommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        content: req.body.content,
      },
    );
  
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update comment',
    });
  }
};