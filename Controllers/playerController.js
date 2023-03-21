const Players = require("../models/players");
const Nations = require("../models/nations")
const clubData = [
  {
    id: 1,
    name: "Barcelona",
  },
  {
    id: 2,
    name: "Real Madrid",
  },
  {
    id: 3,
    name: "Manchester United",
  },
  {
    id: 4,
    name: "Manchester City",
  },
  {
    id: 5,
    name: "PSG",
  },
  {
    id: 6,
    name: "Chelsea",
  },
  {
    id: 7,
    name: "Arsenal",
  },
  {
    id: 8,
    name: "Liverpool",
  },
  {
    id: 9,
    name: "Paris Saint Germain"
  },
  {
    id: 10,
    name: "Al Nassr"
  },
  {
    id: 11,
    name: "Tottenham Hospur"
  }
];
const positions = [
  {
    id: 1,
    name: "Foward",
  },
  {
    id: 2,
    name: "Midfiedler",
  },
  {
    id: 3,
    name: "Defender",
  },
  {
    id: 4,
    name: "Goalkeeper",
  },
];
const PAGE_SIZE = 3;
const PAGE_SIZE_PLAYER_INDEX = 5;

class playerController {

  index(req, res, next) {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      var skip = (page - 1) * PAGE_SIZE_PLAYER_INDEX;
    }
    Nations.find({})
      .then((nations) => {
        Players.find({})
          .skip(skip)
          .limit(PAGE_SIZE_PLAYER_INDEX)
          .populate("nation", ["name", "image", "description"])
          .then((players) => {
            Players.countDocuments({ isCaptain: true }).then((total) => {
              console.log(total);
              var totalPage = Math.ceil(total / PAGE_SIZE);
              res.render("players", {
                total: total,
                title: "The list of Players",
                totalPage: totalPage,
                players: players,
                positionList: positions,
                clubList: clubData,
                nationsList: nations,
                button: req.cookies.ckbutton,
                name: req.cookies.ckname,
                success_msg: req.flash('success_msg'),
                error_msg: req.flash('error_msg')
              });
            });
          })
          .catch((err) => {
            console.log(err);
            next();
          });
      })
      .catch((err) => {
        console.log(err);
        next();
      });

  }

  indexAll(req, res, next) {
    Nations.find({})
      .then((nations) => {
        Players.find({ isCaptain: true })
          .populate("nation", ["name", "image", "description"])
          .then((players) => {

            res.render("index", {
              title: "The list of Players",
              players: players,
              positionList: positions,
              clubList: clubData,
              nationsList: nations,
              button: req.cookies.ckbutton,
              name: req.cookies.ckname,
              success_msg: req.flash('success_msg'),
              error_msg: req.flash('error_msg')
            });
          })
          .catch((err) => {
            console.log(err);
            next();
          });
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  }

  playersAll(req, res, next) {
    Nations.find({})
      .then((nations) => {
        Players.find({})
          .populate("nation", ["name", "image", "description"])
          .then((players) => {
            res.render("playersAll", {
              title: "The list of Players",
              players: players,
              positionList: positions,
              clubList: clubData,
              nationsList: nations,
              button: req.cookies.ckbutton,
              name: req.cookies.ckname
            });
          })
          .catch((err) => {
            console.log(err);
            next();
          });
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  }

  create(req, res, next) {
    Nations.find({})
      .then((nations) => {
        if (nations.length === 0) {
          req.flash('error_msg', "[ERROR] Please input data of nations in Database first!!!");
          return res.redirect('/admin/players')
        }
      })
      .catch((err) => {
        req.flash('error_msg', "[ERROR] Server Error");
        return res.redirect('/admin/players')
      });
    var data = {
      name: req.body.name,
      image: req.body.image,
      club: req.body.club,
      position: req.body.position,
      goals: req.body.goals,
      nation: req.body.nation,
      isCaptain: req.body.isCaptain === undefined ? false : true,
    };
    console.log("data: ", data);
    const player = new Players(data);
    Players.find({ name: player.name }).then((playerCheck) => {
      if (playerCheck.length > 0) {
        req.flash("error_msg", "[ERROR] Duplicate player name!");
        res.redirect("/admin/players");
      } else {
        console.log(player);
        player
          .save()
          .then(() =>{
            req.flash('success_msg', "[SUCCESS] You have created a new player successfully!")
            res.redirect("/admin/players")
          } )
          .catch(next);
      }
    });
  }

  formEdit(req, res, next) {
    const playerId = req.params.playerId;
    Nations.find({})
      .then((nations) => {
        Players.findById(playerId)
          .populate("nation", ["name", "image", "description"])
          .then((player) => {
            res.render("editPlayer", {
              title: "The detail of Player",
              player: player,
              positionList: positions,
              clubList: clubData,
              nationsList: nations,
              button: req.cookies.ckbutton,
              name: req.cookies.ckname
            });
          })
          .catch(next);
      })
      .catch(next);


  }

  edit(req, res, next) {
    var data = {
      name: req.body.name,
      image: req.body.image,
      club: req.body.club,
      position: req.body.position,
      goals: req.body.goals,
      nation: req.body.nation,
      isCaptain: req.body.isCaptain === undefined ? false : true,
    };
    Players.updateOne({ _id: req.params.playerId }, data)
      .then(() => {
        req.flash('success_msg', '[SUCCESS] You have updated ' + data.name + ' successfully .');
        res.redirect("/admin/players");
      })
      .catch((err)=>{
        req.flash('error_msg', '[ERROR] ' + data.name +' already exist!');
        res.redirect("/admin/players");
      });
  }

  delete(req, res, next) {
    let name = ''
    Players.findOne({_id: req.params.playerId})
    .then((player)=>{
      name = player.name
    })
    Players.deleteOne({ _id: req.params.playerId })
      .then(() => {
        req.flash('success_msg', '[SUCCESS] You have deleted ' + name + ' successfully .');
        res.redirect("/admin/players");
      })
      .catch(next);
  }

  getProfile(req, res, next) {
    Nations.find({}).then(() => {
      Players.findOne({ _id: req.params.playerId })
        .populate("nation", ["name", "image", "description"])
        .then((player) => {
          res.render("playerProfile", {
            player: player,
            title: "Profile Of " + player.name,
            button: req.cookies.ckbutton,
            name: req.cookies.ckname
          });
        })
        .catch((err) => {
          console.log(err);
          next()
        });
    })
      .catch((err) => {
        console.log(err);
        next()
      });

  }

  getProfileAll(req, res, next) {
    Nations.find({}).then(() => {
      Players.findOne({ _id: req.params.playerId })
        .populate("nation", ["name", "image", "description"])
        .then((player) => {
          res.render("playerProfileAll", {
            player: player,
            title: "Profile Of " + player.name,
            button: req.cookies.ckbutton,
            name: req.cookies.ckname
          });
        })
        .catch((err) => {
          console.log(err);
          next()
        });
    })
      .catch((err) => {
        console.log(err);
        next()
      });

  }
  filter = async (req, res, next) => {
    console.log("first")
    console.log("req", req)
    const { goals, club, position, nation, isCaptain } = req.body;
    const query = {};

    if (goals) query.goals = { $gte: goals };
    if (club) query.club = club;
    if (position) query.position = position;
    if (nation) {
      const foundNation = await Nations.findOne({ name: nation });
      if (foundNation) {
        query.nation = foundNation._id;
      }
    }
    if (isCaptain) query.isCaptain = true;
    console.log("query", query);
    Players.find(query)
      .populate("nation")
      .then((players) => {
        res.json(players);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  };
  paging(req, res, next) {
    var page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      var skip = (page - 1) * PAGE_SIZE_PLAYER_INDEX;
    }
    Nations.find({})
      .then((nations) => {
        Players.find()
          .skip(skip)
          .limit(PAGE_SIZE_PLAYER_INDEX)
          .populate("nation", ["name", "description"])
          .then((players) => {
            Players.countDocuments().then((total) => {
              console.log(total);
              var totalPage = Math.ceil(total / PAGE_SIZE_PLAYER_INDEX);
              res.json({
                total: total,
                title: "The list of Players",
                totalPage: totalPage,
                players: players,
                positionList: positions,
                clubList: clubData,
                nationsList: nations
              });
            });
            // res.json(players);
          })
          .catch((err) => {
            console.log(err);
            next();
          });
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  }
  search = async (req, res, next) => {
    let payload = req.body.payload.trim();
    console.log("payload: ", payload)
    let searchResult = await Players.find({
      name: { $regex: new RegExp("^" + payload + ".*", "i") },
    }).populate("nation", ["name", "description"]);
    // search = search.slice(0, 10);
    res.send({ payload: searchResult });
  };
}
module.exports = new playerController();
