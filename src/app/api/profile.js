const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = (app, db) => {
  //*GET CURRENT USER'S AVATAR
  app.get("/profile/avatar", async(req,res, next) => {
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
      }
    });
    if (!userProfile) {
      res.sendStatus(404);
    }
    const avatar = await db.avatar.findOne({
      where: {
        id: userProfile.avatarId,
      }
    });
    if (!avatar) {
      res.sendStatus(404);
    }
    res.json(avatar);
  });

  //*GET CURRENT USER'S AVATARS LIST
  app.get("/profile/avatars", async(req,res) => {
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
    var avatar_list = [];
    for (const reward of rewards) {
      if(reward.avatarId != null && avatar_list.findIndex(x => x.id==reward.avatarId)===-1){
        var new_avatar = await db.avatar.findOne({
          where: {
            id: reward.avatarId,
          },
        });
        avatar_list.push(new_avatar);
      }
    };
    res.json(avatar_list);
  });

  //*GET CURRENT USER'S TITLE
  app.get("/profile/title", async(req,res) => {
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
      }
    });
    const title = await db.title.findOne({
      where: {
        id: userProfile.titleId,
      }
    });
    res.json(title);
  });

  //*GET CURRENT USER'S TITLES LIST
  app.get("/profile/titles", async(req,res) => {
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
    var title_list = [];
    for (const reward of rewards) {
      if(reward.titleId != null && title_list.findIndex(x => x.id==reward.titleId)===-1){
        var new_title = await db.title.findOne({
          where: {
            id: reward.titleId,
          },
        });
        title_list.push(new_title);
      }
    };
    res.json(title_list);
  });

  //*GET CURRENT USER'S ACTIONS
  app.get("/profile/actions", async(req,res) => {
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
      }
    });
    const profileActions = await db.profileAction.findAll({
      where: {
        profileId: userProfile.id,
      }
    });
    var action_list = [];
    for (const action of profileActions) {
      var nextGoal = await db.actionGoal.findOne({
        attributes: [
          "actionTitle",
          [sequelize.fn("MIN", sequelize.col("goal")), "goal"],
        ],
        where: { goal: { [Op.gt]: action.maxValueReached } },
        group: "actionTitle",
      });
        var new_action = {};
        new_action.currentValue = action.currentValue;
        new_action.maxValueReached = action.maxValueReached;
        new_action.actionTitle = action.actionTitle;
        new_action["nextGoal"] = nextGoal.goal;
        action_list.push(new_action);
    };
    res.json(action_list);
    //res.json(profileActions);
  });

  //*GET ONE PROFILE BY ID
  app.get("/profile/:id", (req, res) =>
    db.profile
      .findOne({ where: { userId: req.params.id } })
      .then((result) => res.json(result))
  );

  //*GET CURRENT USER'S PROFILE
  app.get("/profile", (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    db.profile
      .findOne({ where: { userId: token.userId } })
      .then((result) => res.json(result));
  });

  //*POST CURRENT USER'S PROFILE
  //! Internal
  app.post("/profile", async (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    db.profile
      .create({
        userId: token.userId,
      })
      .then((profile) => {
        db.profileAction.create({
          currentValue: 0,
          maxValueReached: 0,
          profileId: profile.id,
          actionTitle: "Total login days",
        });
        db.profileAction.create({
          currentValue: 0,
          maxValueReached: 0,
          profileId: profile.id,
          actionTitle: "Workspaces created",
        });
        db.profileAction.create({
          currentValue: 0,
          maxValueReached: 0,
          profileId: profile.id,
          actionTitle: "Documents created",
        })
        return res.json(profile)});
  });

  //*PUT CURRENT USER'S PROFILE
  //! FRONT VALIDATION
  app.put("/profile", (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    db.profile
      .update(req.body, {
        where: {
          userId: token.userId,
        },
        returning: true,
      })
      .then((result) => res.json(result));
  });

  //*PUT CURRENT USER'S AVATAR
  app.put("/profile/avatar=:avatar_id", (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    db.profile
      .update(
        { avatarId: req.params.avatar_id },
        {
          where: {
            userId: token.userId,
          },
          returning: true,
        }
      )
      .then((result) => res.json(result));
  });

  //*PUT CURRENT USER'S TITLE
  app.put("/profile/title=:title_id", (req, res) => {
    const rawToken = req.header("Authorization") || "";
    const splitedToken = rawToken.split(" ").map((x) => x.trim());
    if (splitedToken.length < 2) {
      res.sendStatus(403);
      return;
    }
    const token = jwt.decode(splitedToken[1]);
    db.profile
      .update(
        { titleId: req.params.title_id },
        {
          where: {
            userId: token.userId,
          },
          returning: true,
        }
      )
      .then((result) => res.json(result));
  });

  //*DELETE
  //? todo
};
