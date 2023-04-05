import type { Space } from '@w3ui/keyring-core'

import React, { Fragment, useContext, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'


interface SidebarMenuProps {
  spaces: Space[]
  selected?: Space
  setSelected?: (space: Space) => void
  className?: string
}

export function SidebarMenu({ spaces, selected, setSelected, className = '' }: SidebarMenuProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  
  return <div className={`${className}`}>
    <h2 class="text-2xl">Fireproof</h2>
    <p>Fireproof name: <code>{database.name}</code></p>
    <nav>
      <ul>
      <li>
        <h3>Documents</h3>
        <ul class="list-disc pl-8">
          <li>Create and edit</li>
          <li>Recently browsed</li>
          <li>List all</li>
        </ul>
      </li>
      <li>
        <h3>History</h3>
        <ul class="list-disc pl-8">
          <li>Changes feed</li>
          <li>Visualize clock</li>
        </ul>
      </li>
      <li>
        <h3>Indexes</h3>
        <ul class="list-disc pl-8">
          <li>These are</li>
          <li>Your indexes</li>
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
}
