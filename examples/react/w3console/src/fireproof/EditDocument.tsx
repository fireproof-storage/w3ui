import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

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
        setTheDocument(theDoc)
      }
    }
    getDocument()
  }, [ready, database, updateCount])
  return (
    <div class={`bg-slate-300 p-6`}>
      <h2 class="text-2xl">{theDocument._id}</h2>
      <pre>{JSON.stringify(theDocument)}</pre>
    </div>
  )
}

function DocumentListing({ doc: { _id, ...values } }: any): JSX.Element {
  return (
    <li key={_id} class="pt-1 pb-2">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">*</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            <a href={`/fp-doc/${_id}`}>{_id}</a>
          </p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">{JSON.stringify(values)}</p>
        </div>
      </div>
    </li>
  )
}
