const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// //Todo.remove({}) --removes all
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove()

//Todo.findByIdAndRemove()
Todo.findByIdAndRemove('5b3e5ce895527c25e18e86f9').then((todo) => {
 console.log(todo);
});
