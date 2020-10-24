module.exports = (app, db) => {
  //*GET ALL
  app.get("/avatars", (req, res) => {
    db.avatar.findAll().then((result) => res.json(result));
  });

  //*POST
  //! Faudra faire la validation de l'input
  app.post("/avatar", (req, res) => {
    db.avatar.create(req.body).then((result) => res.json(result));
  });

  //*GET ONE
  //? is it necessary

  //*PUT
  //? is it necessary

  //*DELETE
  //? is it necessary
};
