"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArticleBodyModel = exports.deleteArticleModel = exports.createArticleModel = exports.updateArticleByIdModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const articlesModel_1 = require("./articlesModel");
const usersModel_1 = require("../usersModels/usersModel");
const updateArticleByIdModel = (article_id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    // if inc_votes is not a number, return 400
    if (isNaN(+inc_votes)) {
        return Promise.reject({
            errCode: 400,
            errMsg: "Invalid input for increment votes",
        });
    }
    // get the article by id
    const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    // if article is not found, return 404
    if (!article.article_id)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    // update the votes in the article object
    const newVotes = article.votes + +inc_votes;
    // update the votes in the database
    const newArticle = yield connection_1.default.query(`
    UPDATE articles
    SET votes = $2
    WHERE article_id = $1
    RETURNING *
    `, [article_id, newVotes]);
    // return the updated article
    return newArticle.rows[0];
});
exports.updateArticleByIdModel = updateArticleByIdModel;
const createArticleModel = (author, title, body, topic, article_img_url) => __awaiter(void 0, void 0, void 0, function* () {
    // if any of the required fields are missing, return 400
    if (!title || !body)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    // check if the author exists if not the model will throw a 404 error
    yield (0, usersModel_1.getUserByUsernameModel)(author);
    // check if the topic exists
    const topicExists = yield connection_1.default.query(`SELECT slug FROM topics WHERE slug=$1`, [topic]);
    // if the topic does not exist, return 404
    if (topicExists.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
    let dbQuery;
    let newArticle;
    // if there is an article_img_url, insert it into the database
    if (article_img_url) {
        dbQuery = `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        newArticle = yield connection_1.default.query(dbQuery, [
            author,
            title,
            body,
            topic,
            article_img_url,
        ]);
        // if there is no article_img_url, insert the article with default image
    }
    else {
        dbQuery = `
      INSERT INTO articles (author, title, body, topic)
      VALUES ($1, $2, $3, $4) RETURNING *`;
        newArticle = yield connection_1.default.query(dbQuery, [author, title, body, topic]);
    }
    // add the comment count to the article object
    newArticle.rows[0].comment_count = 0;
    // return the new article
    return newArticle.rows[0];
});
exports.createArticleModel = createArticleModel;
const deleteArticleModel = (article_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    // get the article by id
    const checkArticle = yield connection_1.default.query(`
  SELECT author FROM articles WHERE article_id = $1
  `, [article_id]);
    // if the article is not found, return 404
    if (checkArticle.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article not found" });
    // if the article belongs to another user, return 401
    if (checkArticle.rows[0].author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Article belongs to another user",
        });
    }
    // delete the article from the database
    yield connection_1.default.query(`
    DELETE FROM articles WHERE article_id = $1 RETURNING *
  `, [article_id]);
    return;
});
exports.deleteArticleModel = deleteArticleModel;
const updateArticleBodyModel = (article_id, username, body) => __awaiter(void 0, void 0, void 0, function* () {
    // if the body is missing, return 400
    if (!body)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    // get the article by id if not found the model will throw a 404 error
    const checkArticle = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    // if the article belongs to another user, return 401
    if (checkArticle.author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Article belongs to another user",
        });
    }
    // update the body in the database
    const article = yield connection_1.default.query(`
  UPDATE articles
  SET body = $1
  WHERE article_id = $2
  RETURNING *
  `, [body, article_id]);
    // update the comment count in the article object from the checkArticle object
    article.rows[0].comment_count = checkArticle.comment_count;
    // return the updated article
    return article.rows[0];
});
exports.updateArticleBodyModel = updateArticleBodyModel;
