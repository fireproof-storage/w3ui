import React from 'react'
import { AllLists } from './AllLists'
import { List } from './List'

export const TodoMVC = () => {
  const route = localStorage.getItem('fpdemo-nav')
  let startRoute = { all: true }
  if (route) {
    startRoute = JSON.parse(route)
  }
  const [nav, setNav] = React.useState<any>(startRoute)
  const navigateTo = (opts: any) => {
    console.log('navigateTo', opts)
    localStorage.setItem('fpdemo-nav', JSON.stringify(opts))
    setNav(opts)
  }
  let page = null
  if (nav.all) {
    page = <AllLists navigateTo={navigateTo} />
  } else if (nav.list) {
    page = <List listId={nav.list} navigateTo={navigateTo} />
  }
  return (
    <div class="p-6 mx-4 w-3/4 max-w-prose bg-white text-black dark:bg-slate-700 dark:text-gray-100">
      <h1 class="text-xl text-center font-bold p-2">TodoMVC</h1>
      {page}
      <p class="m-4">
        Play with the classic TodoMVC app to get a feel for Fireproof. Create todo lists and items, and interact with
        live data using the dashboard on the left. The production dashboard includes additional options such as
        replication, sync, and validation. Get started with{' '}
        <a
          class="underline hover:text-orange-600"
          href="https://fireproof.storage/documentation/usefireproof-hook-for-react/"
        >
          the Fireproof React hook.
        </a>
      </p>
    </div>
  )
}
