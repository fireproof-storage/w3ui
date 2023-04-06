import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import DynamicTable from './DynamicTable'
import { CodeHighlight } from './CodeHighlight'

interface BrowseIndexProps {}

function evalFn(fnString: string) {
  let mapFn
  try {
    eval(`mapFn = ${fnString}`)
    return mapFn
  } catch (e) {
    console.error(e)
  }
}

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
      console.log('maybeIt', maybeIt)
      maybeIt.mapFn = evalFn(maybeIt.mapFnString)
      setTheIndex(maybeIt)
    }
  }, [ready, database])
  useEffect(() => {
    async function getQuery() {
      if (ready && database && theIndex.query) {
        setQueryResult(await theIndex.query())
      }
    }
    getQuery()
  }, [ready, database, theIndex, updateCount])

  const headers = ['key', 'id', 'value']

  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">Index</h2>
      <CodeHighlight code={theIndex.mapFnString}/>
      <DynamicTable headers={headers} th="key" link={['id']} rows={queryResult.rows} />
    </div>
  )
}
