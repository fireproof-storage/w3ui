import type { Space } from '@w3ui/keyring-core'

import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'


interface SidebarMenuProps {

}

export function SidebarMenu({ }: SidebarMenuProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [indexList, setIndexList] = useState<any>([])
  useEffect(() => {
    setIndexList([...database.indexes.values()])
  }, [ready, database])
  return <>
  <style>{`
  .fp-sidebar a {
    text-decoration: underline;
  }
  .fp-sidebar a:hover {
    color: #ff8200;
  }
  `}
  </style>
  <div class="fp-sidebar">
    <h3>Database name: <code>{database.name}</code></h3>
    <nav>
      <ul>
      <li>
        <h3>Documents</h3>
        <ul class="list-disc pl-8">
          <li>Create and edit</li>
          <li>Recently browsed</li>
          <li><a href="/fp-docs">List all</a></li>
        </ul>
      </li>
      <li>
        <h3>History</h3>
        <ul class="list-disc pl-8">
          <li><a href="/fp-changes">Changes feed</a></li>
          <li>Visualize clock</li>
        </ul>
      </li>
      <li>
        <h3>Indexes</h3>
        <ul class="list-disc pl-8">
          {indexList.map((index: any, i: number) => (
            <li><a href={`/fp-index?id=${i}`}>{index.mapFnString}</a></li>
          ))}
        </ul>
      </li>
      <li>
        <h3>Validation</h3>
        <ul class="list-disc pl-8">
          <li>Function editor</li>
        </ul>
      </li>
      <li>
        <h3>Replication</h3>
        <ul class="list-disc pl-8">
          <li>web3.storage</li>
        </ul>
      </li>
      <li>
        <h3>Sync</h3>
        <ul class="list-disc pl-8">
          <li>WebRTC</li>
        </ul>
      </li>
      </ul>
    </nav>
  </div>
  </>
}
