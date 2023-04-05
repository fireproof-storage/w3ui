import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface BrowseChangesProps {}

export function BrowseChanges({}: BrowseChangesProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theChanges, setTheChanges] = useState<any>([])
  console.log('BrowseChanges', updateCount, theChanges)
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
        const results = await database.changesSince() // todo need head
        setTheChanges(results.rows)
      }
    }
    getDocuments()
  }, [ready, database, updateCount])
  return (
    <div class={` bg-slate-800 p-6`}>
      <h2 class="text-2xl">Recent changes</h2>

      <ul class="max-w-md pt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {theChanges.map((row: any) => (
          <ChangeListing row={row} />
        ))}
      </ul>
    </div>
  )
}

function ChangeListing({ row: { key, value } }: any): JSX.Element {
  return (
    <li key={key} class="pt-1 pb-2">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">*</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
            <a href={`/fp-doc?id=${key}`}>{key}</a>
          </p>
          <p class="text-sm text-gray-500 truncate dark:text-gray-400">{JSON.stringify(value)}</p>
        </div>
      </div>
    </li>
  )
}
