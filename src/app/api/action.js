const jwt = require("jsonwebtoken");

module.exports = (app, db) => {
  //*GET ALL
  app.get("/actions", (req, res) => {
    db.action.findAll(
	).then((result) => res.json(result));
  });

  //*GET ONE
  app.get("/action", (req, res) =>
  db.action
    .findOne({ where: { title: req.body.title } })
    .then((result) => res.json(result))
);

  //*POST
  app.post("/action", (req, res) => {
    db.action.create(req.body).then((result) => res.json(result));
  });

  //*POST INCREMENTS ONE ACTION DONE
  // ! Setup proper response code
  // ? Shorter implementation maybe
  app.post("/action/done", async (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403)
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    const profile = await db.profile.findOne({
      where: { userId: token.userId },
    });

    const profileId = profile.id;

    let profileAction = await db.profileAction.findOne({
      where: {
        profileId: profileId,
        actionTitle: req.body.actionTitle,
      },
    });

    if (profileAction === null) {
      await db.profileAction
        .create({
          currentValue: 1,
          maxValueReached: 1,
          profileId: profileId,
          actionTitle: req.body.actionTitle,
        })
        .then((result) => {
          updateGoalReward(1, req.body.actionTitle, profile, db);
          res.json(result);
        });
    } else {
      profileAction.update({ currentValue: (profileAction.currentValue += 1) });
      console.log("UPDATE : " + profileAction.currentValue);

      if (profileAction.currentValue > profileAction.maxValueReached) {
        console.log("NEW MAX VALUE : " + profileAction.currentValue);
        await profileAction.update({
          maxValueReached: profileAction.currentValue,
        });

        updateGoalReward(profileAction.maxValueReached, req.body.actionTitle, profile, db);
      }
      res.json(profileAction);
    }
  });

  //*POST DECREMENTS ONE ACTION
  app.post("/action/undone", async (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    const profile = await db.profile.findOne({
      where: { userId: token.userId },
    });

    const profileId = profile.id;

    let profileAction = await db.profileAction.findOne({
      where: {
        profileId: profileId,
        actionTitle: req.body.actionTitle,
      },
    });

    profileAction.update({ currentValue: (profileAction.currentValue -= 1) });
    console.log("UPDATE : " + profileAction.currentValue);

    res.json(profileAction);
  });

  //*POST RESET USER ACTIONS
  app.post("/action/reset", async (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    const profile = await db.profile.findOne({
      where: { userId: token.userId },
    });

    const profileId = profile.id;

    let profileAction = await db.profileAction.findOne({
      where: {
        profileId: profileId,
        actionTitle: req.body.actionTitle,
      },
    });

    profileAction.update({ currentValue: 0 });
    console.log("UPDATE : " + profileAction.currentValue);

    res.json(profileAction);
  });

  //*PUT
  //? is it necessary

  //*DELETE
  //? is it necessary
};

async function updateGoalReward(goalReached, actionTitle, profile, db) {
  const actionGoal = await db.actionGoal.findOne({
    where: {
      goal: goalReached,
      actionTitle: actionTitle,
    },
  });

  if (actionGoal) {
    await profile.addReward(actionGoal.rewardId);
    const profileRewards = await profile.getRewards({
      where: { id: actionGoal.rewardId },
    });
    const count = profileRewards[0].profileReward.count + 1;
    await profile.setRewards(profileRewards, { through: { count: count } });
  }
}
