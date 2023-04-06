import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import DynamicTable from './DynamicTable'

interface BrowseChangesProps {}

export function BrowseChanges({}: BrowseChangesProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theChanges, setTheChanges] = useState<any>([])
  // console.log('BrowseChanges', updateCount, theChanges)
  const [firstClock, setFirstClock] = useState(JSON.parse(localStorage.getItem('firstClock')||'[]') || null)
  console.log('firstClock', firstClock)
  useEffect(() => {
    if (ready && database) {
      addSubscriber('BrowseChanges', () => {
        setUpdateCount(count => count + 1)
      })
    }
  }, [ready, database])
  useEffect(() => {
    async function getDocuments() {
      if (ready && database) {
        const results = await database.changesSince(firstClock) // todo need head
        if (!firstClock.length) {
          localStorage.setItem('firstClock', JSON.stringify(results.clock))
          setFirstClock(results.clock)
        } else 
        setTheChanges(results.rows)
      }
    }
    getDocuments()
  }, [ready, database, updateCount, firstClock])


  function resetChangesClock() {
    localStorage.removeItem('firstClock')
    setFirstClock([])
  }

  const headers = new Map()
  const theDocs = []
  for (const {key, value} of theChanges) {
    const theDoc = {_id : key, ...value}
    theDocs.push(theDoc)
    for (const key of Object.keys(theDoc)) {
      if (headers.has(key)) {
        headers.set(key, headers.get(key) + 1)
      } else {
        headers.set(key, 1)
      }
    }
  }
  headers.delete('_id')
  const sortedHeaders = ['_id',, ...Array.from(headers.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key)]

  return (
    <div class={` bg-slate-800 p-6`}>
      <h2 class="text-2xl">Recent changes</h2>
      <a href="#" onClick={resetChangesClock}>Reset changes clock</a>
      <DynamicTable headers={sortedHeaders} rows={theDocs} />
    </div>
  )
}

function ChangeListing({ row: { key, value } }: any): JSX.Element {
  return (
    <li key={key} class="pt-1 pb-2">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">*</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            <a href={`/fp-doc?id=${key}`}>{key}</a>
          </p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">{JSON.stringify(value)}</p>
        </div>
      </div>
    </li>
  )
}
