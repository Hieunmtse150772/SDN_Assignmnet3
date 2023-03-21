const Nations = require("../models/nations");
const Players = require("../models/players");
class nationController {

  index(req, res, next) {
    
    Nations.find({})
      .then((nations) => {
        res.render("nations", {
          
          title: "The list of nations",
          nations: nations,
          button: req.cookies.ckbutton,
          name: req.cookies.ckname,
          success_msg: req.flash('success_msg'),
          error_msg: req.flash('error_msg')
        });
      })
      .catch(next);
  }

  nationAll(req, res, next){
    Nations.find({})
      .then((nations) => {
        res.render("nationsAll", {
          title: "The list of nations",
          nations: nations,
          button: req.cookies.ckbutton,
          name: req.cookies.ckname
        });
      })
      .catch(next);
  }

  create(req, res, next) {
    var data = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description
    }
    const nation = new Nations(data);
    Nations.find({name: nation.name})
    .then((nationCheck)=>{
      if (nationCheck.length > 0) {
        req.flash("error_msg", "[ERROR] Duplicate nation name!");
        res.redirect("/admin/nations");
      } else {
        console.log(nation);
        nation
          .save()
          .then(() =>{
            req.flash('success_msg', "[SUCCESS] You have created a new nation successfully!")
            res.redirect("/admin/nations")
          } )
          .catch(next);
      }
    })
  }
  
  formEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId)
      .then((nation) => {
        res.render("editNation", {
          title: "The detail of " + nation.name,
          nation: nation,
          button: req.cookies.ckbutton,
          name: req.cookies.ckname
        });
      })
      .catch(next);
  }
  edit(req, res, next) {
    var data = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description
    }
    Nations.updateOne({ _id: req.params.nationId }, data)
      .then(() => {
        req.flash('success_msg', '[SUCCESS] You have updated ' + data.name + ' successfully .'); 
        res.redirect("/admin/nations");
      })
      .catch((err)=>{
        req.flash('error_msg', '[ERROR] ' + data.name + ' already exist! '); 
        res.redirect("/admin/nations");
      });
  }
  delete(req, res, next) {   
    let name =''
    Nations.findOne({_id: req.params.nationId})
    .then((nation)=>{
      name = nation.name
    })
    Players.findOne({nation: req.params.nationId})
    .then((data)=>{
      if(!data){
        Nations.deleteOne({ _id: req.params.nationId })
      .then(() => {
        req.flash('success_msg', '[SUCCESS] You have deleted ' + name + ' successfully .'); 
        res.redirect("/admin/nations");
      })
      .catch(next);
      } else {
        req.flash('error_msg', '[ERROR] ' + name +' already in use! Can not delete!'); 
        res.redirect("/admin/nations")
      }
    })
    
    
    
  }
}
module.exports = new nationController();
