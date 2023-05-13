import { Index, Database } from '@fireproof/core'
// import { Index, Fireproof } from '../../../../../../../fireproof/packages/fireproof/src/fireproof.js'


declare global {
  interface Window {
    fireproof: Database
  }
}
// should be in makeQueryFunctions
export const defineIndexes = (database: Database) => {
  console.log('defineIndexes')
  new Index(database, 'allLists', function (doc, map) {
    if (doc.type === 'list') map(doc.type, doc)
  })
  new Index(database, 'todosByList', function (doc, map) {
    if (doc.type === 'todo' && doc.listId) {
      map([doc.listId, doc.createdAt], doc)
    }
  })
  window.fireproof = database
  return database
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(1) // determinstic fixtures

export async function loadFixtures(database: Database) {
  console.log('loadFixtures')
  const nextId = (prefix = '') => prefix + rand().toString(32).slice(2)
  const listTitles = ['Building Apps', 'Having Fun', 'Getting Groceries']
  const todoTitles = [
    [
      'In the browser',
      'On the phone',
      'With or without Redux',
      'Login components',
      'GraphQL queries',
      'Automatic replication and versioning'
    ],
    ['Rollerskating meetup', 'Motorcycle ride', 'Write a sci-fi story with ChatGPT'],
    ['Macadamia nut milk', 'Avocado toast', 'Coffee', 'Bacon', 'Sourdough bread', 'Fruit salad']
  ]
  let ok: { id: any }
  for (let j = 0; j < 3; j++) {
    ok = await database.put({ title: listTitles[j], type: 'list', _id: nextId('' + j) })
    for (let i = 0; i < todoTitles[j].length; i++) {
      await database.put({
        _id: nextId(),
        title: todoTitles[j][i],
        listId: ok.id,
        completed: rand() > 0.75,
        type: 'todo',
        createdAt: '2' + i
      })
    }
  }
  await database.index('allLists').query({ range : [0,1]})
}
