import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
// import { Index } from '@fireproof/core'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import {Index} from '../../../../../../fireproof/packages/fireproof/src/fireproof.js'
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
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [theIndex, setTheIndex] = useState<any>({ mapFnString: '' })
  const emptyMap = 'function(doc, map) { map(doc._id, doc) }'
  const [editorCode, setEditorCode] = useState<string>(emptyMap)
  const [queryResult, setQueryResult] = useState<any>({ rows: [] })
  const id = window.location.search.split('id=').pop()

  async function getQuery() {
    if (ready && database) {
      if (id) {
        theIndex.query && setQueryResult(await theIndex.query())
      } else {
        // runTempQuery() // todo why is this running the default query not the editorCode?
      }
    }
  }

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
    if (id) getQuery()
    else runTempQuery()
    
    addSubscriber('BrowseIndex', () => {
      getQuery()
    })
  }, [ready, database, theIndex])

  const headers = ['key', 'id', 'value']

  const saveTempQuery = async () => {
    const mapFn = evalFn(editorCode)
    if (mapFn) {
      const alreadyExists = [...database.indexes.values()].findIndex((index: any) => index.mapFnString === editorCode)
      if (alreadyExists > -1) {
        document.location = 'dbindex?id=' + alreadyExists
      } else {
        const index = new Index(database, mapFn, null)
        await index.query({limit: 0}) // force the index to be added to the clock
        document.location = 'dbindex?id=' + (database.indexes.size - 1)
      }
    }
  }
  const runTempQuery = () => {
    const mapFn = evalFn(editorCode)
    if (mapFn) {
      const index = new Index(database, mapFn, null, { temporary: true })
      index.query().then(setQueryResult)
    }
  }

  const editorChanged = ({ code }: any) => {
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
          <div class="flow-root p-4">
            <button
              class="float-right rounded-lg py-2 px-4 ml-6 bg-slate-500 hover:bg-yellow-800"
              onClick={runTempQuery}
            >
              Query
            </button>
            <button
              class="float-right rounded-lg py-2 px-4 ml-6 bg-slate-700 hover:bg-yellow-800"
              onClick={saveTempQuery}
            >
              Save
            </button>
          </div>
        </>
      )}
      <DynamicTable headers={headers} th="key" link={['id']} rows={queryResult.rows} />
    </div>
  )
}
