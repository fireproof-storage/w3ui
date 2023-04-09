import React, { useState, useEffect, useContext } from 'react'

import DynamicTable from './DynamicTable'

import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
// import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface ListDocumentsProps {}

export function ListDocuments({}: ListDocumentsProps): JSX.Element {
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
    for (const key of Object.keys(doc)) {
      if (headers.has(key)) {
        headers.set(key, headers.get(key) + 1)
      } else {
        headers.set(key, 1)
      }
    }
  }
  headers.delete('_id')

  // sort the headers with the highest count first
  const sortedHeaders = [
    '_id',
    ...Array.from(headers.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key)
  ]
  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">List Documents</h2>
      <DynamicTable headers={sortedHeaders} rows={allDocuments} />
    </div>
  )
}
