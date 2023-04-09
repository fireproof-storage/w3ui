import React, { useState, useEffect, useContext } from 'react'

import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
// import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import DynamicTable from './DynamicTable'

interface BrowseChangesProps {}

export function BrowseChanges({}: BrowseChangesProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theChanges, setTheChanges] = useState<any>([])
  // console.log('BrowseChanges', updateCount, theChanges)
  const [firstClock, setFirstClock] = useState(JSON.parse(localStorage.getItem('firstClock')||'[]') || null)
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
    document.location = document.location
  }

  const headers = new Map()
  const recentChanges = []
  for (const {key, value} of theChanges) {
    const theDoc = {_id : key, ...value}
    recentChanges.push(theDoc)
    for (const key of Object.keys(theDoc)) {
      if (headers.has(key)) {
        headers.set(key, headers.get(key) + 1)
      } else {
        headers.set(key, 1)
      }
    }
  }
  headers.delete('_id')
  const sortedHeaders = ['_id', ...Array.from(headers.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key)]
  return (
    <div class={` bg-slate-800 p-6`}>
      <a href="#" class="float-right hover:text-orange-400" onClick={resetChangesClock}>Hide existing changes</a>
      <h2 class="text-2xl">Recent changes</h2>
      <DynamicTable headers={sortedHeaders} rows={recentChanges.reverse()} />
    </div>
  )
}

