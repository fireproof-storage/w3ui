import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

import 'jsoneditor-react/es/editor.min.css';


interface EditDocumentProps {}

export function EditDocument({}: EditDocumentProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theDocument, setTheDocument] = useState<any>({})
  const id = window.location.search.split('id=').pop()
  console.log('EditDocument', updateCount, theDocument)
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
        setTheDocument(JSON.parse(JSON.stringify(theDoc)))
      }
    }
    getDocument()
  }, [ready, database, updateCount])
  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">{theDocument._id}</h2>
      <pre>{JSON.stringify(theDocument, null, 2)}</pre>
    </div>
  )
}

