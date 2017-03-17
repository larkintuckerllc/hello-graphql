const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));
const fakeDatabase = {
  itemsById: {
    'gcat': {
      id: 'gcat',
      name: 'grumpy cat',
      description: 'He is one cranky dude.',
    },
    'sdog': {
      id: 'sdog',
      name: 'super dog',
    },
  },
  itemsIds: [
    'gcat',
    'sdog',
  ],
  partsById: {
    0: {
      id: 0,
      name: 'fur',
      itemId: 'gcat',
    },
    1: {
      id: 1,
      name: 'teeth',
      itemId: 'gcat',
    },
    2: {
      id: 3,
      name: 'tail',
      itemId: 'sdog',
    }
  },
  partsIds: [
    0,
    1,
    2,
  ],
};
const schema = buildSchema(`
  type Part {
    id: Int!
    name: String!
  }
  type Item {
    id: String!
    name: String!
    description: String
    parts: [Part]!
  }
  type Query {
    items: [Item]!
  }
`);
class Part {
  constructor(id) {
    this.id = id;
  }
  id() {
    return this.id;
  }
  name() {
    return fakeDatabase.partsById[this.id].name;
  }
  itemId() {
    return fakeDatabase.partsById[this.id].itemId;
  }
}
class Item {
  constructor(id) {
    this.id = id;
  }
  id() {
    return this.id;
  }
  name() {
    return fakeDatabase.itemsById[this.id].name;
  }
  description() {
    const item = fakeDatabase.itemsById[this.id];
    return item.description !== undefined ? item.description : null;
  }
  parts() {
    return delay(1000).then (() => fakeDatabase.partsIds
      .map(id => new Part(id))
      .filter(part => part.itemId() === this.id)
    );
  }
}
const root = {
  items: () => delay(1000).then (() => fakeDatabase.itemsIds.map(id => new Item(id))),
};
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
