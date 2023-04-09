import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import InputArea from './InputArea'
import TodoItem from './TodoItem.jsx'
// import { FireproofCtx, FireproofCtxValue } from '../../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'

import {  TodoDoc } from '../interfaces'
import { makeQueryFunctions } from './makeQueryFunctions'


export function List({listId, navigateTo}): JSX.Element {
  // first data stuff
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const { addTodo, toggle, destroy, updateTitle, fetchListWithTodos } = makeQueryFunctions({ ready, database })
  const [editing, setEditing] = useState('')
  const [{list, todos}, setData] = useState({list:{title: '', _id: '', type: 'list'}, todos : []})
  addSubscriber('List', async () => {
    getList()
  })

  async function getList() {
    setData(await fetchListWithTodos(listId))
  }

  useEffect(() => {
    getList()
  }, [ready, database])


  const edit = (todo: TodoDoc) => () => setEditing(todo._id)
  const onSubmit = async (title: string) => await addTodo(list._id, title)

  return (
    <div>
      <p class="text-center p-2">
        Current list: <strong>{list.title}</strong>
      </p>
      <button class="italic p-2 hover:text-orange-600" onClick={() => navigateTo({all : true})}>&lt; Back to all lists</button>

      <ul class="p-2">
        {todos.map((todo: TodoDoc) => {
          const handle = (fn: (arg0: TodoDoc, arg1: string) => any) => (val: string) => [setEditing(''), fn(todo, val)]
          return (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handle(toggle)}
              onDestroy={handle(destroy)}
              onSave={handle(updateTitle)}
              onEdit={edit(todo)}
              editing={editing === todo._id}
              onCancel={console.log}
            />
          )
        })}
      </ul>
      <div class="italic p-2">
        Add an item:
      </div>
      <InputArea onSubmit={onSubmit} placeholder="Name the item and hit enter." />
    </div>
  )
}
