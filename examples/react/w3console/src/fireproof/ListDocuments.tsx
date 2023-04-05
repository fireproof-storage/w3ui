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

      <DynamicTable headers={sortedHeaders} />
    </div>
  )
}
