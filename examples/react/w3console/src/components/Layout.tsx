import { tosUrl, Logo } from '../brand'
import { FireproofMenu } from '../fireproof/FireproofMenu'

interface LayoutComponentProps {
  sidebar?: JSX.Element | JSX.Element[]
  children: JSX.Element | JSX.Element[]
}
type LayoutComponent = (props: LayoutComponentProps) => JSX.Element

export const DefaultLayout: LayoutComponent = ({ sidebar = <div></div>, children }) => {
  return (
    <>
      <FireproofMenu />
      <div className="flex min-h-full w-full dark">
        <nav className="flex-none w-64 bg-gray-900 text-white pb-4 h-screen">
          <div className="flex flex-col justify-between h-full">
            {sidebar}
          </div>
        </nav>
        <main className="grow bg-gray-dark text-white p-4 h-screen overflow-scroll">{children}</main>
      </div>
    </>
  )
}


