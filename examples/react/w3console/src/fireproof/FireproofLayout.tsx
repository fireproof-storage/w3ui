// import { FireproofCtx, useFireproof } from '@fireproof/core/hooks/use-fireproof'
import { Fireproof } from '../../../../../../fireproof/packages/fireproof/index.js'
import { FireproofCtx, useFireproof } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { DefaultLayout } from '../components/Layout'
// import Loader from '../components/Loader'
import { TodoMVC } from './todomvc/TodoMVC.js'

import { defineIndexes } from './todomvc/setupFireproof.js'

import { SidebarMenu as FireproofSidebar } from '../fireproof/SidebarMenu'

declare global {
  interface Window {
    fireproof: Fireproof
  }
}
export default function FireproofLayout({ children }): JSX.Element {
  const fp = useFireproof(
    defineIndexes,
    async () => {},
    FireproofSidebar.dbName
  )

  return (
    <FireproofCtx.Provider value={fp}>
      <DefaultLayout
        sidebar={
          <div class="flex-grow flex flex-col justify-between">
            <FireproofSidebar />
          </div>
        }
      >
        <div class="flex mb-4">
  <div class="w-1/2  h-12">{children}</div>
  <div class="w-1/2  h-12">
    <TodoMVC/>
  </div>
</div>
        
      </DefaultLayout>
    </FireproofCtx.Provider>
  )
}
