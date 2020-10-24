import express from "express";
import bodyParser from "body-parser";
import db from "./models";

import apiProfile from "./app/api/profile";
import apiAction from "./app/api/action";
import apiPing from "./app/api/ping";
import apiLevel from "./app/api/level";
import apiAvatar from "./app/api/avatar";
import apiTitle from "./app/api/title";

const app = express();
app.use(bodyParser.json());
app.use(express.static("app/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

apiProfile(app, db);
apiAction(app, db);
apiLevel(app, db);
apiPing(app, db);
apiAvatar(app, db);
apiTitle(app, db);

const port = process.env.GAMIFICATION_PORT || 3000;

const connectToPostgres = () => {
  return new Promise((resolve, reject) => {
    db.sequelize
      .sync()
      .then(resolve)
      .catch((error) => {
        console.error(
          "Unable to connect to PostgreSQL (" + error + ") Retrying..."
        );

        setTimeout(() => connectToPostgres().then(resolve).catch(reject), 2000);
      });
  });
};

connectToPostgres().then(() => {
  //db.sequelize.drop(); // ! DROP ALL : supprime toutes les tables de la BDD
  app.listen(port, () => console.log("App listening on port " + port + "!"));
}) /*
  .then(function() {
    return db.sequelize.drop();   // ! DROP ALL : supprime toutes les tables de la BDD
  })*/;
