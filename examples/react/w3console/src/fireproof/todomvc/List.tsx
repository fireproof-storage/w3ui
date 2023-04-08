import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import InputArea from './InputArea'
import TodoItem from './TodoItem.jsx'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'

import {  TodoDoc } from '../interfaces'
import { makeQueryFunctions } from './makeQueryFunctions'


export function List({listId, navigateTo}): JSX.Element {
  // first data stuff
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const { addTodo, toggle, destroy, updateTitle, fetchListWithTodos } = makeQueryFunctions({ ready, database })
  const [editing, setEditing] = useState('')
  const [{list, todos}, setData] = useState({list:{title: '', _id: '', type: 'list'}, todos : []})
  addSubscriber('List', async () => {
    console.log('db changes')
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
      <div class="text-center p-2">
        Current list: <strong>{list.title}</strong>
      </div>

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
      <InputArea onSubmit={onSubmit} placeholder="Add a new item to your list." />
      <button class="italic" onClick={() => navigateTo({all : true})}>Back to all lists</button>
    </div>
  )
}
