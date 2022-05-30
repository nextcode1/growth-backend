const express = require("express");
const corsMiddleWare = require("cors");
// Auth middleware: our own code. Checks for the existence of a token in a header called `authentication`.
const authMiddleWare = require("./auth/middleware");
const usersRouter = require("./routers/users");
const skillsRouter = require("./routers/skills");
const projectsRouter = require("./routers/projects");
const recrutersRouter = require("./routers/recruters");
const certificationsRouter = require("./routers/certifications");
const newsRouter = require("./routers/news");

const { PORT } = require("./config/constants");

// Create an express app
const app = express();
app.use(express.json());
// CORS middleware:  * Since our api is hosted on a different domain than our client
// we are are doing "Cross Origin Resource Sharing" (cors)
// Cross origin resource sharing is disabled by express by default
app.use(corsMiddleWare());

/**
 * Middlewares
 *
 * It is advisable to configure your middleware before configuring the routes
 * If you configure routes before the middleware, these routes will not use them
 *
 */
app.use("/users", usersRouter);
app.use("/news", newsRouter);
app.use("/skills", skillsRouter);
app.use("/projects", projectsRouter);
app.use("/recruters", recrutersRouter);
app.use("/certifications", certificationsRouter);

// express.json():be able to read request bodies of JSON requests a.k.a. body-parser
const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

/**
 * Routes
 *
 * Define your routes and attach our routers here (now that middlewares are configured)
 */

// POST endpoint which requires a token for testing purposes, can be removed
app.post("/authorized_post_request", authMiddleWare, (req, res) => {
  // accessing user that was added to req by the auth middleware
  const user = req.user;
  // don't send back the password hash
  delete user.dataValues["password"];

  res.json({
    youPosted: {
      ...req.body,
    },
    userFoundWithToken: {
      ...user.dataValues,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
