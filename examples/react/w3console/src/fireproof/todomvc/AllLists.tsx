import React, { useEffect } from 'react'
import { useContext } from 'react'
import InputArea from './InputArea'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
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
      <div class="italic p-2">View a todo list:</div>
      <ul class="p-2 divide-y divide-slate-500">
        {lists.map((l, i) => {
          return linkToList(l, i, navigateTo)
        })}
      </ul>
      <div class="italic p-2">Create a new list:</div>
      <InputArea onSubmit={addList} placeholder="Name a new list and hit enter" autoFocus={false} />
    </div>
  )
}

const linkToList = ({ title, _id }: ListDoc, i: number, navigateTo: Function) => {
  const link =
    _id === '' ? (
      <label>&nbsp;</label>
    ) : (
      <label>
        <button>{title}</button>
      </label>
    )

  return (
    <li
      onClick={() => navigateTo({ list: _id })}
      class="p-4 hover:bg-gray-200 dark:hover:bg-slate-600  "
      key={_id || i}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 mr-2 float-left"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      {link}
    </li>
  )
}
