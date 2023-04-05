import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface BrowseIndexProps {}

export function BrowseIndex({}: BrowseIndexProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theIndex, setTheIndex] = useState<any>({mapFnString : ''})
  const [queryResult, setQueryResult] = useState<any>({rows : []})
  const id = window.location.search.split('id=').pop() || '0'
  useEffect(() => {
    const indexes = [...database.indexes.values()]
    const maybeIt = indexes[parseInt(id)]
    if (maybeIt) {
      setTheIndex(maybeIt)
    }
  }, [ready, database])
  useEffect(() => {
    async function getQuery() {
      if (ready && database && theIndex.query) {
        setQueryResult(await theIndex.query({}, false))
      }
    }
    getQuery()
  }, [ready, database, theIndex, updateCount])
  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">Index</h2>
      <pre>{theIndex.mapFnString}</pre>
      <ul class="max-w-md pt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {queryResult.rows.map((row: any) => (
          <RowListing row={row} />
        ))}
      </ul>
    </div>
  )
}

function RowListing({ row : {id, key, value} }: any): JSX.Element {
  return (
    <li key={id} class="pt-1 pb-2">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
         *
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white"><a href={`/fp-doc?id=${id}`}>{id}</a></p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">{JSON.stringify(value)}</p>
        </div>
      </div>
    </li>
  )
}