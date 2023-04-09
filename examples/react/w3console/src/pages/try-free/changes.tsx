import { BrowseChanges } from '../../fireproof/BrowseChanges'
import FireproofLayout from '../../fireproof/FireproofLayout'
export default function FireproofDashboard(): JSX.Element {
  return (
    <FireproofLayout>
      <BrowseChanges />
    </FireproofLayout>
  )
}
