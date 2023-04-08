import React, { useEffect } from 'react'
import { useContext } from 'react'
import InputArea from './InputArea'
import { FireproofCtx, useFireproof } from '../../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { ListDoc } from './interfaces'
import { makeQueryFunctions } from './makeQueryFunctions'

const threeEmptyLists: ListDoc[] = [
  { title: '', _id: '', type: 'list' },
  { title: '', _id: '', type: 'list' },
  { title: '', _id: '', type: 'list' }
]

/**
 * A React functional component that renders a list of todo lists.
 *
 * @returns {JSX.Element}
 *   A React element representing the rendered lists.
 */
export function AllLists({ navigateTo }): JSX.Element {
  // first data stuff
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const { addList, fetchAllLists } = makeQueryFunctions({ ready, database })
  const [lists, setLists] = React.useState<ListDoc[]>(threeEmptyLists)

  async function getLists() {
    setLists(await fetchAllLists())
  }

  addSubscriber('AllLists', () => {
    getLists()
  })

  useEffect(() => {
    getLists()
  }, [ready, database])

  return (
    <div>
      <div class="italic p-2">
        Choose a todo list or create a new one:
      </div>
      <ul class="p-2">
        {lists.map((l, i) => {
          return todoItem(l, i, navigateTo)
        })}
      </ul>
      <InputArea onSubmit={addList} placeholder="Name a new list and hit enter" />
    </div>
  )
}

const todoItem = ({ title, _id }: ListDoc, i: number, navigateTo: Function) => {
  const link =
    _id === '' ? (
      <label>&nbsp;</label>
    ) : (
      <label>
        <button  onClick={() => navigateTo({ list: _id })}>
          {title}
        </button>
      </label>
    )

  return <li class="p-2 hover:bg-gray-200 rounded" key={_id || i}>{link}</li>
}
