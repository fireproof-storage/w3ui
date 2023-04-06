

// import { FireproofCtx, useFireproof } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, useFireproof } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { DefaultLayout } from '../components/Layout'


import { SidebarMenu as FireproofSidebar } from '../fireproof/SidebarMenu'
import { BrowseChanges as FireproofDetail } from '../fireproof/BrowseChanges'

export default function FireproofDashboard(): JSX.Element {
  const fp = useFireproof((database: any) => {
    window.fireproof = database
  })

  


  return (
    <FireproofCtx.Provider value={fp}>
      <DefaultLayout
        sidebar={
          <div class="flex-grow flex flex-col justify-between">
            <FireproofSidebar />
          </div>
        }
      >
        <FireproofDetail />
      </DefaultLayout>
    </FireproofCtx.Provider>
  )
}
