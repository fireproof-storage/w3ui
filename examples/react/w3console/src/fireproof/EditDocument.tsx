import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import { CodeHighlight, EditableCodeHighlight } from './CodeHighlight'

interface EditDocumentProps {}

export function EditDocument({}: EditDocumentProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theDocument, setTheDocument] = useState<any>({})
  const [docToSave, setDocToSave] = useState<any>({})

  const id = window.location.search.split('id=').pop()
  // console.log('EditDocument', updateCount, theDocument)
  useEffect(() => {
    if (ready && database) {
      addSubscriber('EditDocument', () => {
        setUpdateCount(count => count + 1)
      })
    }
  }, [ready, database])
  useEffect(() => {
    async function getDocument() {
      if (ready && database) {
        const theDoc = await database.get(id) // with meta
        const { data } = docAndMeta(theDoc)
        const jsonDoc = JSON.stringify(data)
        setDocToSave(jsonDoc)
        setTheDocument(JSON.parse(JSON.stringify(theDoc)))
      }
    }
    getDocument()
  }, [ready, database, updateCount])

  async function saveDocument(meta) {
    const data = JSON.parse(docToSave)
    // console.log(meta._id)
    // console.log(data)
    // console.log('docToSave', {_id : meta._id, ...data})
    await database.put({_id : meta._id, ...data})
    // console.log('saved')
  }

  const { data, meta } = docAndMeta(theDocument)

  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">_id: {theDocument._id}</h2>
      <h3>Document data</h3>
      <EditableCodeHighlight onChange={setDocToSave} code={JSON.stringify(data, null, 2)} theme={theme} />
      <button
        onClick={() => {
          saveDocument(meta)
        }}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-5 rounded"
      >
        Save
      </button>
      <h3>Metadata</h3>
      <CodeHighlight code={JSON.stringify(meta, null, 2)} theme={defaultProps.theme} />
    </div>
  )
}

function docAndMeta(doc) {
  const data = {}
  const meta = {}
  Object.keys(doc).forEach((key: string) => {
    if (key.startsWith('_')) {
      meta[key] = doc[key]
    } else {
      data[key] = doc[key]
    }
  })
  return { data, meta }
}
