// import type { ChangeEvent } from 'react'

// import { useEffect, useState } from 'react'
// import { ShareIcon } from '@heroicons/react/20/solid'
// import md5 from 'blueimp-md5'

// import { FireproofCtx, useFireproof } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, useFireproof } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { DefaultLayout } from '../components/Layout'
// import Loader from '../components/Loader'

import { SidebarMenu as FireproofSidebar } from '../fireproof/SidebarMenu'
import { BrowseChanges as FireproofDetail } from '../fireproof/BrowseChanges'

export default function FireproofDashboard(): JSX.Element {
  const fp = useFireproof(
    (database: any) => {
      window.fireproof = database
    },
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
        <FireproofDetail />
      </DefaultLayout>
    </FireproofCtx.Provider>
  )
}
