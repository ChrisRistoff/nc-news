import express from "express";
import * as topic from "./routers/topicsRouter";
import * as articles from "./routers/articlesRouter";
import * as comments from "./routers/commentsRouter";
import * as replies from "./routers/repliesRouter"
import { usersRouter } from "./routers/usersRouter";
import {
  sqlErrors,
  customErrors,
  serverError,
} from "./middleware/errorHandlers";
import { getDocs } from "./documentation/docController";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

export const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NC news API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ["./dist/routers/*.js"],
};

const openApiSpecs = swaggerJSDoc(options)

app.use(express.json());

//docs
app.get("/api", getDocs);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpecs));

//topics
app.use("/api", topic.topicRouter);
app.use("/api", topic.protectedTopicRouter);

//articles
app.use("/api", articles.articleRouter);
app.use("/api", articles.protectedArticleRouter);

//comments
app.use("/api", comments.commentsRouter);
app.use("/api", comments.protectedCommentsRouter);

//replies
app.use("/api", replies.repliesRouter)

//users
app.use("/api", usersRouter);

app.use(sqlErrors, customErrors, serverError);
