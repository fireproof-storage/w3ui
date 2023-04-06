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
  const [docToSave, setDocToSave] = useState<any>('')
  const [needsSave, setNeedsSave] = useState(false)

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

  async function saveDocument(_id:string) {
    const data = JSON.parse(docToSave)
    const resp = await database.put({_id, ...data})
    if (!_id) {
      window.location.href = `/fp-doc?id=${resp.id}`
    }
    setNeedsSave(false)
  }

  function editorChanged({ code, valid }) {
    setNeedsSave(valid)
    setDocToSave(code)
  }

  const { data, meta : {_id, ...meta} } = docAndMeta(theDocument)
  const idFirstMeta = { _id, ...meta}
  const title = _id ? `Edit document: ${_id}` : 'Create new document'
  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl pb-2">{title}</h2>
      <h3>Editable data fields</h3>
      <EditableCodeHighlight onChange={editorChanged} code={JSON.stringify(data, null, 2)} theme={theme} />
      <button
        onClick={() => {
          saveDocument(_id)
        }}
        class={`${needsSave ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400'}  font-bold py-2 px-4 m-5 rounded`}
      >
        Save
      </button>
      <h3>Fireproof metadata</h3>
      <CodeHighlight code={JSON.stringify(idFirstMeta, null, 2)} theme={defaultProps.theme} />
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
