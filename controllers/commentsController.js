const {
  createCommentForArticleModel,
  deleteCommentByIdModel,
  updateCommentByIdModel,
  getAllCommentsForArticleModel,
} = require("../models/commentsModel");

exports.createCommentForArticle = async (req, res, next) => {
  const { body } = req.body;
  const { article_id } = req.params;
  const { username } = req.user;

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
  const { p, limit } = req.query;

  try {
    const comments = await getAllCommentsForArticleModel(article_id, p, limit);

    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { username } = req.user;

  try {
    await deleteCommentByIdModel(comment_id, username);

    res.status(204).send({});
  } catch (error) {
    next(error);
  }
};

exports.updateCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const newComment = await updateCommentByIdModel(comment_id, inc_votes);

    res.status(200).send({ newComment });
  } catch (error) {
    next(error);
  }
};
