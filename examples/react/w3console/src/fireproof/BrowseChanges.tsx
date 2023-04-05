import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface BrowseChangesProps {}

export function BrowseChanges({}: BrowseChangesProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [allDocuments, setAllDocuments] = useState<any>([])
  console.log('BrowseChanges', updateCount, allDocuments)
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
        const allDocs = await database.allDocuments()
        setAllDocuments(allDocs.rows.map((row: { value: any }) => row.value))
      }
    }
    getDocuments()
  }, [ready, database, updateCount])
  return (
    <div class={` bg-slate-800 p-6`}>
      <h2 class="text-2xl">List Documents</h2>

      <ul class="max-w-md pt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {allDocuments.map((doc: any) => (
          <DocumentListing doc={doc} />
        ))}
      </ul>
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
            <a href={`/fp-doc?id=${_id}`}>{_id}</a>
          </p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">{JSON.stringify(values)}</p>
        </div>
      </div>
    </li>
  )
}
