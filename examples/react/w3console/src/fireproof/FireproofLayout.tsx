import { ReactNode } from 'react'

import { Fireproof } from '@fireproof/core'
import { FireproofCtx, useFireproof } from '@fireproof/core/hooks/use-fireproof'
// import { Fireproof } from '../../../../../../fireproof/packages/fireproof/index.js'
// import { FireproofCtx, useFireproof } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

import { DefaultLayout } from '../components/Layout'
import { TodoMVC } from './todomvc/TodoMVC.js'
import { SidebarMenu as FireproofSidebar } from './SidebarMenu'
import { defineIndexes, loadFixtures } from './todomvc/setupFireproof.js'


declare global {
  interface Window {
    fireproof: Fireproof
  }
}

type FireproofLayoutProps = {
  children: ReactNode
}

export default function FireproofLayout({ children }:FireproofLayoutProps): JSX.Element {
  const fp = useFireproof(defineIndexes, loadFixtures, FireproofSidebar.dbName)

  return (
    <FireproofCtx.Provider value={fp}>
      <DefaultLayout
        sidebar={
          <div class="flex-grow flex lg:flex-col justify-between">
            <FireproofSidebar />
          </div>
        }
      >
        <div class="flex mb-4">
          <div class="w-full md:w-1/2  h-12">{children}</div>
          <div class="w-full md:w-1/2  h-12">
            <TodoMVC />
          </div>
        </div>
      </DefaultLayout>
    </FireproofCtx.Provider>
  )
}
