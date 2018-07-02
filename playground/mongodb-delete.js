//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  const db = client.db('TodoApp') //will error if missing as db not defined
  console.log('Connected to MongoDB server');

  // //deleteMany
  // db.collection('Todos').deleteMany({test: 'Eat lunch'}).then((result) => {
  //   console.log(result); //didn't work
  // });

  //deleteMany
  db.collection('Users').deleteMany({name: 'Heather'}).then((result) => {
    console.log(result); //didn't work
  });

  // //delete deleteOne
  // db.collection('Todos').deleteOne({test: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

   // //findOneAndDelete
   // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
   //   console.log(result);
   // });

   //findOneAndDelete
   db.collection('Users').findOneAndDelete({location: 'Indy'}).then((result) => {
     console.log(result);
   });

  //client.close();
});
