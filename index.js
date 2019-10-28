// implement your API here
console.log("\n===  It works!  ===\n")

const express = require('express');
const server = express();
const Users = require("./data/db.js"); // DB required
const cors = require('cors')

server.use(express.json())
server.use(cors())

//Is server on?
server.get('/', (req,res)=>{
    res.send("It's working! ⭐")
})

//POST : /api/users
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
  
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide a Name and Bio for the User." });
    } else {
      Users.insert(req.body)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(() => {
          res.status(500).json({
            errorMessage:
              "There was an error whilst saving the User to the DataBase.",
          });
        });
    }
  });

//GET : /api/users  
server.get('/api/users', (req, res) => {
    Users.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: "The Users information couldn't be retrieved.",
        });
      });
  });

//GET : /api/users/:id
server.get('/api/users/:id',cors(), (req, res) => {
    Users.findById(req.params.id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({ message: "The User with the specified ID doesn't exist." });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ errorMessage: "The User information couldn't be retrieved." });
      });
  });

//DELETE : /api/users/:id
server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id)
      .then(count => {
        if (count && count > 0) {
          res.status(200).json({
            message: "The User was deleted.",
          });
        } else {
          res
            .status(404)
            .json({ message: "The User with the specified ID doesn't exist." });
        }
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "The User couldn't be removed." });
      });
  });

//PUT : /api/users/:id
server.put('/api/users/:id', (req, res) => {
    const { name, bio } = req.body;
  
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide a Name and Bio for the User." });
    } else {
      Users.update(req.params.id, req.body)
        .then(user => {
          if (user) {
            res.status(200).json(user);
          } else {
            res
              .status(404)
              .json({
                message: "The User with the specified ID does not exist.",
              });
          }
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: "The User information couldn't be modified.",
          });
        });
    }
  });


const port = 42069;
server.listen(port, ()=> console.log(`\n===  ⭐  API on Port ${port} ⭐   ===\n`))