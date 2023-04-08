import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import DbIndex from '../../../../../../fireproof/packages/fireproof/src/db-index'
import DynamicTable from './DynamicTable'
import { CodeHighlight, EditableCodeHighlight } from './CodeHighlight'

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
  const { ready, database, persist, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theIndex, setTheIndex] = useState<any>({ mapFnString: '' })
  const emptyMap = 'function(doc, map) { map(doc._id, doc) }'
  const [editorCode, setEditorCode] = useState<string>(emptyMap)
  const [queryResult, setQueryResult] = useState<any>({ rows: [] })
  const id = window.location.search.split('id=').pop()
  useEffect(() => {
    if (id) {
      const indexes = [...database.indexes.values()]
      const maybeIt = indexes[parseInt(id)]
      if (maybeIt) {
        maybeIt.mapFn = evalFn(maybeIt.mapFnString)
        setTheIndex(maybeIt)
      }
    } else {
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


  const saveTempQuery = () => {
    const mapFn = evalFn(editorCode)
    if (mapFn) {
      const alreadyExists = [...database.indexes.values()].findIndex((index: any) => index.mapFnString === editorCode)
      if (alreadyExists > -1) {
        document.location = '/fireproof/dbindex?id=' + alreadyExists
      } else {
        new DbIndex(database, mapFn, null)
        persist()      
        document.location = '/fireproof/dbindex?id=' + (database.indexes.size - 1)
      }
    }
  }
  const runTempQuery = () => {
    const mapFn = evalFn(editorCode)
    if (mapFn) {
      const index = new DbIndex(database, mapFn, null, { temporary: true })
      index.query().then(setQueryResult)
    }
  }

  const editorChanged = ( {code} : any) => {
    setEditorCode(code)
  }

  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">Index</h2>
      {id ? (
        <CodeHighlight code={theIndex.mapFnString} />
      ) : (
        <>
          <EditableCodeHighlight onChange={editorChanged} code={emptyMap} language="js" />
          <div class="flow-root p-4" >
            <button class="float-right rounded-lg py-2 px-4 ml-6 bg-slate-500 hover:bg-yellow-800" onClick={runTempQuery}>Query</button>
            <button class="float-right rounded-lg py-2 px-4 ml-6 bg-slate-700 hover:bg-yellow-800" onClick={saveTempQuery}>Save</button>
          </div>
        </>
      )}
      <DynamicTable headers={headers} th="key" link={['id']} rows={queryResult.rows} />
    </div>
  )
}
