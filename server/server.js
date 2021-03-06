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

app.post('/todos',authenticate, (req, res) => {
      var todo = new Todo ({
      text: req.body.text,
      _creator: req.user._id
    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }, (err) => {
    res.status(400).send(err);
  });
});

//GET /todos/id
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  //res.send(req.params);

  if (!ObjectID.isValid(id)) {
    //console.log('Id not valid');
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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
app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = awaitTodo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  } catch(err){
    res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id: id,_creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
    return res.status(404).send();
    }

    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(err){
    res.status(400).send(err);
  }
});

  app.get('/users/me',authenticate, (req, res) => {
    res.send(req.user);
  });

  //POST /users/login {email, password}
  app.post('/users/login', async(req, res) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user =  await User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (err) {
      res.status(400).send();
    }
  });

app.delete('/users/me/token', authenticate, async(req, res) => {
try {
  await req.user.removeToken(req.token);
  res.status(200).send();
}catch(err) {
  res.status(400).send();
}
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
