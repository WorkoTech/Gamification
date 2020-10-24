const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
module.exports = (app, db) => {
    //*GET ALL
    app.get("/levels", (req, res) => {
      db.level.findAll().then((result) => res.json(result));
    });

    //*GET ONE
    app.get("/level/:id", (req, res) =>
    db.level
      .findOne({ where: { id: req.params.id } })
      .then((result) => res.json(result))
  );

  //*GET CURRENT USER LEVEL
  //? Shorter implementation maybe
  app.get("/level", async (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);

    const userProfile = await db.profile.findOne({
      where: {
        userId: token.userId,
      },
      include: db.reward,
    });
	const rewards = userProfile.get("rewards");
    let xpTotal = 0;
    rewards.forEach((reward) => {
      xpTotal += reward.get("xpValue")*reward.get("profileReward").get("count");
    });

    const lvlAct = await db.level.findOne({
      attributes: [
        "name",
        [sequelize.fn("MAX", sequelize.col("xpThreshold")), "xpThreshold"],
      ],
      where: { xpThreshold: { [Op.lte]: xpTotal } },
      group: "name",
    });
    const value = await db.level.findOne({
      where: {
        name: lvlAct.name,
      }
    }).then((result) => result.id);
    const lvlNext = await db.level.findOne({
      attributes: [
        "name",
        [sequelize.fn("MIN", sequelize.col("xpThreshold")), "xpThreshold"],
      ],
      where: { xpThreshold: { [Op.gt]: xpTotal } },
      group: "name",
    });

    res.json({ value, xpTotal, lvlAct, lvlNext });
  });

  //*PUT
  //? is it necessary

  //*DELETE
  //? is it necessary
};
