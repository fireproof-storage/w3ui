// import { Index, Fireproof } from '@fireproof/core'
import { Index, Fireproof } from '../../../../../../../fireproof/packages/fireproof/index.js'


declare global {
  interface Window {
    fireproof: Fireproof
  }
}
export const defineIndexes = (database: Fireproof) => {
  database.allLists = new Index(database, function (doc, map) {
    if (doc.type === 'list') map(doc.type, doc)
  }, null, {name : 'allLists'})
  database.todosByList = new Index(database, function (doc, map) {
    if (doc.type === 'todo' && doc.listId) {
      map([doc.listId, doc.createdAt], doc)
    }
  }, null, {name : 'todosByList'})
  window.fireproof = database
  return database
}

