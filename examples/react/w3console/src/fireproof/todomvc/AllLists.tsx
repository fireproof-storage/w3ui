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
export function AllLists({navigateTo}): JSX.Element {
  // first data stuff
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const { addList, fetchAllLists } = makeQueryFunctions({ ready, database })
  const [lists, setLists] = React.useState<ListDoc[]>(threeEmptyLists)

  async function getLists() {
    setLists(await fetchAllLists())
  }

  addSubscriber('AllLists', () => {
    console.log('AllLists')
    getLists()
  })

  useEffect(() => {
    getLists()
  }, [ready, database])

  return (
    <div>
      <div className="listNav">
        <button
          onClick={async () => {
            console.log('await database.changesSince()', await database.changesSince())
          }}
        >
          Choose a list.
        </button>
        <label></label>
      </div>
      <ul className="todo-list">{lists.map((l, i)=>{
        return todoItem(l, i, navigateTo)
      })}</ul>
      <InputArea onSubmit={addList} placeholder="Create a new list or choose one" />
    </div>
  )
}

const todoItem = ({ title, _id }: ListDoc, i: number, navigateTo: Function) => {
  if (_id === '') {
    return (
      <li key={_id || i}>
        <label>&nbsp;</label>
      </li>
    )
  } else {
    return (
      <li key={_id || i}>
        <label>
          <a href="#" onClick={() => navigateTo({list:_id})}>
            {title}</a>
        </label>
      </li>
    )
  }
}
