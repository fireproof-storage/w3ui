import React from 'react'
import { AllLists } from './AllLists'
import { List } from './List'

export const TodoMVC = () => {
  const [nav, setNav] = React.useState<any>({all : true})
  const navigateTo = (opts: any) => {
    console.log('navigateTo', opts)
    setNav(opts)
  }
  let page = null
  if (nav.all) {
    page = <AllLists navigateTo={navigateTo}/>
  } else if (nav.list) {
    page = <List listId={nav.list} navigateTo={navigateTo}/>
  }
  return (
    <div class="p-4 w-full max-w-prose bg-white text-black">
      <h1 class="text-xl text-center font-bold p-2">TodoMVC</h1>
      {page}
    </div>
  )
}