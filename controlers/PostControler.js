import PostModel from '../models/Post.js';
import LikeModel from '../models/PostLike.js';

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create new post',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to receive post',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOne(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Failed to receive post',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to receive post',
    });
  }
};

// export const getMy = async (req, res) => {

// };

export const remove = async (req, res) => {
try {
const postId = req.params.id;
PostModel.findOneAndDelete(
  {
    _id: postId,
  },
  (err, doc) => {
    if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Failed to receive post',
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Post not found',
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
    message: 'Failed to receive post',
  });
}
};

export const update = async (req, res) => {
try {
  const postId = req.params.id;

  await PostModel.updateOne(
    {
      _id: postId,
    },
    {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags,
    },
  );

  res.json({
    success: true,
  });
} catch (err) {
  console.log(err);
  res.status(500).json({
    message: 'Failed to update post',
  });
}
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    const existingPostLike = await LikeModel.findOne({ postId, userId });

    if (existingPostLike) {
      throw new Error("Post is already liked");
    }
    

    const doc = new LikeModel({
      post: postId,
      user: userId,
    });

    const like = await doc.save();

    await PostModel.findOneAndUpdate(
      {
        id: postId,
      },
      {
        $inc: { likeCount: 1 },
      },
    );

    res.json(like);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create new like',
    });
  }
};

export const removeLike = async (req, res) => {
  try {
    const likeId  = req.params.id;
    const postId  = req.params.id2;
    
  
    const like = await LikeModel.findById(likeId);

    if (!like) {
      return res.status(404).json({
        message: "Like does not exist"
      });
    }
    else{
      await PostModel.findOneAndUpdate(
        {
          id: postId,
        },
        {
          $inc: { likeCount: -1 },
        },
      );
    };

  LikeModel.findOneAndDelete(
    {
      _id: likeId,
    },
    (err, doc) => {
      if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Failed to receive like data',
          });
        }
  
        if (!doc) {
          return res.status(404).json({
            message: "Like does not exist"
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
      message: 'Failed to receive like data',
    });
  }
};