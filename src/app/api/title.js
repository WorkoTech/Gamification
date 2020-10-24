module.exports = (app, db) => {
  //*GET ALL
  app.get("/titles", (req, res) => {
    db.title.findAll().then((result) => res.json(result));
  });

  //*POST
  //! Faudra faire la validation de l'input
  app.post("/title", (req, res) => {
    db.title.create(req.body).then((result) => res.json(result));
  });

  //*PUT
  //? todo

  //*DELETE
  //? todo
};
