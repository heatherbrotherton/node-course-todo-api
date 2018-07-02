//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  const db = client.db('TodoApp') //will error if missing as db not defined
  console.log('Connected to MongoDB server');

  // //findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b3a421f727a5b53565a352a')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // //findOneAndUpdate
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b36991134f8947240a2adc9')
  },{
    $set: {
      name: 'Heather'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //client.close();
});
