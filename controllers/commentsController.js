const { createCommentForArticleModel, deleteCommentByIdModel } = require("../models/commentsModel");
const { getAllCommentsForArticleModel } = require("../models/commentsModel");

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

exports.getAllCommentsForArticle = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comments = await getAllCommentsForArticleModel(article_id);

    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await deleteCommentByIdModel(comment_id)

    res.status(204).send({})
  } catch (error) {
    next(error)
  }
};
