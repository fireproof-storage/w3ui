import type { Space } from '@w3ui/keyring-core'

import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface ListDocumentsProps {
  spaces: Space[]
  selected?: Space
  setSelected?: (space: Space) => void
  className?: string
}

function formatTableCellContent(obj:any) {
  if (typeof obj === 'string') return obj
  return JSON.stringify(obj)
}

export function ListDocuments({ spaces, selected, setSelected, className = '' }: ListDocumentsProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [allDocuments, setAllDocuments] = useState<any>([])
  // console.log('allDocuments', updateCount, allDocuments)
  useEffect(() => {
    if (ready && database) {
      addSubscriber('ListDocuments', () => {
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

  const headers = new Map()
  for (const doc of allDocuments) {
    // iterate over object keys and count the number of times each key is used
    // by using the key of the map as the key of the object, and the value as the count
    for (const key of Object.keys(doc)) {
      if (headers.has(key)) {
        headers.set(key, headers.get(key) + 1)
      } else {
        headers.set(key, 1)
      }
    }
  }
  // remove _id from the headers
  const idCount = headers.get('_id')
  headers.delete('_id')

  // sort the headers with the highest count first
  const sortedHeaders = Array.from(headers.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div class={`${className}  bg-slate-800 p-6`}>
      <h2 class="text-2xl">List Documents</h2>

      <div class="relative overflow-x-auto dark">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                _id
                <sub class="text-gray-400 dark:text-gray-500">({idCount})</sub>
              </th>
              {sortedHeaders.map(([header, count]) => (
                <th scope="col" class="px-6 py-3">
                  {header}
                  <sub class="text-gray-400 dark:text-gray-500">({count})</sub>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDocuments.map(({ _id, ...fields }: any) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <a href={`/fp-doc?id=${_id}`}>{_id}</a>
                </th>
                {sortedHeaders.map(([header]) => (
                  <td class="px-6 py-4">{formatTableCellContent(fields[header])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
