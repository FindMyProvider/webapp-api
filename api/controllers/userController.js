const User = require('../models/user');

//---
const mongoose = require('mongoose');

//---
const bcrypt = require("bcryptjs");

//---
const jwt = require("jsonwebtoken");

module.exports = {
  getAll: async (req, res, next) => {
    await User.find()
      .select()
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          users: docs
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },
  getOne: async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    await Mission.findById(id)
      .select("_id identifiant password")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            user: doc
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },
  search: async (req, res, next) => {
    const input = req.params.input;
    await User.find({ "nom": { "$regex": input, "$options": "i" } })
      .select()
      .exec()
      .then(docs => {
        const response = {
          users: docs
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },
  searchParPrenom: async (req, res, next) => {
    const input = req.params.input;
    await User.find({ "prenom": { "$regex": input, "$options": "i" } })
      .select()
      .exec()
      .then(docs => {
        const response = {
          users: docs
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },
  newUser: async (req, res, next) => {
    await User.find({ identifiant: req.body.identifiant })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "L'identifiant existe déjà !"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              id = new mongoose.Types.ObjectId()
              const user = new User({
                _id: id,
                id: id,
                identifiant: req.body.identifiant,
                password: hash,
                nom : req.body.nom,
                prenom : req.body.prenom,
                level : req.body.lvl,
                contact: req.body.contact,
                client : req.body.client,
                entreprise : req.body.entreprise
              });
              console.log(user)
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created"
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  },
  loginUser: async (req, res, next) => {    
    console.log(req.body)
    User.find({ identifiant: req.body.identifiant })
    .exec()
    .then(user => {
      if (user.length < 1) {        
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed at password"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              identifiant: user[0].identifiant,
              userId: user[0]._id,
              level: user[0].level
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            user : user[0]

          });
        }
        res.status(401).json({
          message: "Auth failed here"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  },
  //updateUserPassword
  updateUserPassword: async (req, res, next) => {
    const userId = req.params.id;
    bcrypt.hash(req.body.password,10, (err, hash) => { 
      if(hash) {
        User.updateOne({ _id : userId }, {
          $set: {
            password: hash
          }
        })
        .exec()
  .then(data => {
      console.log(data);
      res.status(200).json({
        message: 'User updated',
    });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
        });
      }    
    })    
  },
  updateUser: async (req, res, next) => {
    const userId = req.params.id;
    bcrypt.hash(req.body.password,10, (err, hash) => { 
      if(hash) {
        User.updateOne({ _id : userId }, {
          $set: {
            password: hash,
            identifiant: req.body.identifiant,
            nom: req.body.nom,
            prenom: req.body.prenom,
            level: req.body.level,
            contact : req.body.contact
          }
        })
        .exec()
  .then(data => {
      console.log(data);
      res.status(200).json({
        message: 'User updated',
    });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
        });
      }    
    })    
  },
  updateFavoris: async (req, res, next) => {
    const film = await Film.findById(req.body.film);
    console.log(film)
    await User.findByIdAndUpdate(req.params.id,{
      $push: { 
        favoris: film 
      }
  })
  .exec()
  .then(data => {
      console.log(data);
      res.status(200).json({
        message: 'Favoris updated',
        user: data
    });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
        });
},
updateDownloaded: async (req, res, next) => {
  const film = await Film.findById(req.body.film);
  console.log(film)
  await User.findByIdAndUpdate(req.params.id,{
    $push: { 
      downloaded: film 
    }
})
.exec()
.then(data => {
    console.log(data);
    res.status(200).json({
      message: 'downloaded updated',
      user: data
  });
})
.catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
      });
},
updateVus: async (req, res, next) => {
  const film = await Film.findById(req.body.film);
  console.log(film)
  await User.findByIdAndUpdate(req.params.id,{
    $push: { 
      vus: film 
    }
})
.exec()
.then(data => {
    console.log(data);
    res.status(200).json({
      message: 'Vus updated',
      user: data
  });
})
.catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
      });
},
deleteFavoris: async (req, res, next) => { 
  //const film = await Film.findById(req.body.film); 
  console.log(req.params.film);

      await User.findByIdAndUpdate(req.params.id,{$pull: {favoris: req.params.film}},{multi: true})        
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Film deleted'
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          });
      });

},
remoteCmd: async (req, res, next) => {
  const { exec } = require('child_process');
  
  exec("scrapy crawl purecpu", {cwd: 'C:\\Users\\salah\\Documents\\Projets\\comparateur_provider\\scrap\\scrap'}, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
  
  
},
deleteDownloaded: async (req, res, next) => { 
  //const film = await Film.findById(req.body.film); 
  console.log(req.params.film);

      await User.findByIdAndUpdate(req.params.id,{$pull: {downloaded: req.params.film}},{multi: true})        
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Film deleted'
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          });
      });

},
  deleteUser: async (req, res, next) => {
      
      await User.findByIdAndRemove(req.params.id)
          .exec()
          .then(result => {
              res.status(200).json({
                  message: 'User deleted',
                  deletedUser: {
                      id: result._id,
                      name: result.name,
                      identifiant: result.identifiant,
                  }
              });
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              });
          });

          let posts = Post.find()
                      .populate('user')
                      .select("_id message user date")
                      .exec()
                      .then()
                      .catch();



          for(const p of posts){
            if(p._id == req.params.id){
              posts.pull(p);
              await posts.save();
            }
            
        }

  },
  logout: async (req, res, next) => { 


    
  },

  getFavoris: async (req, res, next) => {
    const id = req.params.id;
    await User.findById(id)
      .populate("favoris")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            favoris: doc.favoris
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },
  getDownloaded: async (req, res, next) => {
    const id = req.params.id;
    await User.findById(id)
      .populate("downloaded")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            downloaded: doc.downloaded
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },
  getVus: async (req, res, next) => {
    const id = req.params.id;
    await User.findById(id)
      .populate("vus")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            vus: doc.vus
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
};