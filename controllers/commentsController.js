const { createCommentForArticleModel } = require("../models/commentsModel");

exports.createCommentForArticle = async (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  try {
    const comment = await createCommentForArticleModel(
      body,
      article_id,
      username,
    );

    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};
