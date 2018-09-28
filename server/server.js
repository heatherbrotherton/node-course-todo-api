//To start the db
// sudo mongod
// path = ~/data/db
// to start the TodoApp
// path = ~/data/node-todo-api/

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo ({
      text: req.body.text
    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (err) => {
    res.status(400).send(err);
  });
});

//GET /todos/id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  //res.send(req.params);

  if (!ObjectID.isValid(id)) {
    //console.log('Id not valid');
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo){
      //return console.log('Id not found');
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
      res.status(400).send();
  });
});

//Delete
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
      res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'] );

  if (!ObjectID.isValid(id)) {
    //console.log('Id not valid');
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
    return res.status(404).send();
    }

    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((err) => {
    res.status(400).send(err);
    })
  });



  app.get('/users/me',authenticate, (req, res) => {
    res.send(req.user);
  });

  //POST /users/login {email, password}
  app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
          res.header('x-auth', token).send(user);
      });
    }).catch((err) => {
      res.status(400).send();
    });
    //res.send(body);
  });



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
