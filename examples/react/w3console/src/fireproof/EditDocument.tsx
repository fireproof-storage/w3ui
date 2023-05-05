import React, { Fragment, useState, useEffect, useContext } from 'react'

import { FireproofCtx, FireproofCtxValue } from '@fireproof/react'
// import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/react'
import { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import { CodeHighlight, EditableCodeHighlight } from './CodeHighlight'

interface EditDocumentProps {}

export function EditDocument({}: EditDocumentProps): JSX.Element {
  const { ready, database } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theDocument, setTheDocument] = useState<any>({})
  const [docToSave, setDocToSave] = useState<any>('{}')
  const [needsSave, setNeedsSave] = useState(false)

  const id = window.location.search.split('id=').pop()
  // console.log('EditDocument', updateCount, theDocument)
  useEffect(() => {
    if (ready && database) {
      database.subscribe(() => {
        setUpdateCount(count => count + 1)
      })
    }
  }, [ready, database])
  useEffect(() => {
    async function getDocument() {
      if (ready && database && id) {
        const theDoc = await database.get(id).catch((e: { message: string }) => {
          if (e.message !== 'Not found') throw e; 
          return ({_id: id})
        })
        const { data } = docAndMeta(theDoc)
        const jsonDoc = JSON.stringify(data)
        setDocToSave(jsonDoc)
        setTheDocument(JSON.parse(JSON.stringify(theDoc)))
      }
    }
    getDocument()
  }, [ready, database, updateCount])

  async function saveDocument(_id: string) {
    const data = JSON.parse(docToSave)
    const resp = await database.put({ _id, ...data })
    if (!_id) {
      window.location.href = `doc?id=${resp.id}`
    }
    setNeedsSave(false)
  }

  async function deleteDocument(_id: string) {
    await database.del(_id)
    window.location.href = `docs`
  }

  function editorChanged({ code, valid }) {
    setNeedsSave(valid)
    setDocToSave(code)
  }

  const {
    data,
    meta: { _id, ...meta }
  } = docAndMeta(theDocument)
  const idFirstMeta = { _id, ...meta }
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
        class={`${
          needsSave ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400'
        }  font-bold py-2 px-4 m-5 rounded`}
      >
        Save
      </button>
      <button
        onClick={() => deleteDocument(_id)}
        class={`${
          !!_id ? 'bg-gray-700 hover:bg-orange-700 hover:text-white' : 'bg-gray-700 '
        }  text-gray-400 font-bold py-2 px-4 my-5 rounded`}
      >
        Delete
      </button>
      <h3>Fireproof metadata</h3>
      <CodeHighlight code={JSON.stringify(idFirstMeta, null, 2)} theme={defaultProps.theme} />
    </div>
  )
}

function docAndMeta(doc: { [x: string]: any }) {
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
