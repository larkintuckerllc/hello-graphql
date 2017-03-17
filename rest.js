const express = require('express');
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
const app = express();
app.get('/items', (req, res) => {
  delay(1000).then(() => res.send(fakeDatabase.itemsIds.map(o => fakeDatabase.itemsById[o])));
});
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  delay(1000).then(() => {
    const item = fakeDatabase.itemsById[id];
    if (item === undefined) return res.status(404).send();
    res.send(item);
  });
});
app.get('/parts', (req, res) => {
  const { item } = req.query;
  if (item === undefined) {
    delay(1000).then(() => res.send(fakeDatabase.partsIds.map(o => fakeDatabase.partsById[o])));
  } else {
    delay(1000).then(() => res.send(
      fakeDatabase
        .partsIds
        .map(o => fakeDatabase.partsById[o])
        .filter(o => o.itemId === item)
    ));
  }
});
app.get('/parts/:id', (req, res) => {
  const { id } = req.params;
  delay(1000).then(() => {
    const part = fakeDatabase.partsById[id];
    if (part === undefined) return res.status(404).send();
    res.send(part);
  });
});
app.listen(3000, () => console.log('Rest server started on 3000.'));
