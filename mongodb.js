require('dotenv').config();

const { MongoClient, ObjectID } = require('mongodb');

const url = process.env.MONGODB_URL;

(async () => {
  console.log('Connection');
  const db = await MongoClient.connect(url);


  // // Insert a document
  // const user = {
  //   firstName: 'Cynthia'
  // };
  // await db.collection('test').insert(user);

  // // List all documents
  // const users = await db.collection('test').find({}).toArray();
  // console.log(users);

  // // Get one document
  // const user = await db.collection('test').findOne({ _id: ObjectID('5a24110ea97d04446bcb72da') });
  // console.log(user);

  // // Delete one document
  // await db.collection('test').remove({ _id: ObjectID('5a24110ea97d04446bcb72da') });


  // Update a document
  // await db.collection('test').update(
  //   { _id: ObjectID('5a240ebe6a70d9443888ba64') },
  //   { $set: { lastName: 'Henaff', age: 27 } }
  // );

  // const users = await db.collection('test').find({ firstName: 'Kevin' }).toArray();
  // console.log(users);

  // const users = await db.collection('test').find({ age: { $gt: 17 } }).toArray();
  // console.log(users);

  const users = await db.collection('test').find({}).toArray();
  console.log(users);


  db.close();
  console.log('Bye');
})();
