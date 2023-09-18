import React, { useContext, useEffect, useState } from 'react'

import { FireproofCtx, FireproofCtxValue, useFireproof } from '@fireproof/react'
// import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'

interface SidebarMenuProps {}

export function SidebarMenu({}: SidebarMenuProps): JSX.Element {
  const { ready, database } = useFireproof('todomvc') //useContext(FireproofCtx) as FireproofCtxValue
  const [indexList, setIndexList] = useState<any>([])
  const [changes, setChanges] = useState([])
  const [firstClock, setFirstClock] = useState(JSON.parse(localStorage.getItem('firstClock') || '[]') || null)

  // console.log('sidebarMenu', ready, database, indexList, changes, firstClock)

  // todo extract to useChanges
  async function queryChanges() {
    if (ready && database) {
      const results = await database.changesSince(firstClock)
      if (!firstClock.length) {
        localStorage.setItem('firstClock', JSON.stringify(results.clock))
        setFirstClock(results.clock)
      } else setChanges(results.rows)
    }
  }

  useEffect(() => {
    if (ready && database) {
      // todo move inside useFireproof.addSubscriber
      database.subscribe(() => {
        queryChanges()
      })
    }
    queryChanges()
  }, [ready, database])

  useEffect(() => {
    if (ready) setIndexList([...database.indexes.values()])
  }, [ready, database])

  return (
    <>
      <style>
        {`
  .fp-sidebar a {
    text-decoration: underline;
  }
  .fp-sidebar a:hover {
    color: #ff8200;
  }
  `}
      </style>
      <div class=" dark">
        <aside
          id="sidebar-multi-level-sidebar"
          class="fixed w-64 h-screen transition-transform -translate-x-full translate-x-0"
        >
          <div class="h-full px-4 py-5 overflow-y-auto">
            <ul class="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span class="ml-3">Account</span>
                </a>
              </li>
              <li>
                <a
                  href="docs"
                  class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>

                  <span class="flex-1 ml-3 whitespace-nowrap text-black dark:text-white">All Documents</span>
                </a>
              </li>
              <li>
                <a
                  href="doc"
                  class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    class="flex-shrink-0 w-6 h-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span class="flex-1 ml-3 whitespace-nowrap text-black dark:text-white">Create Document</span>
                </a>
              </li>
              <li>
                <a
                  href="changes"
                  class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span class="flex-1 ml-3 whitespace-nowrap text-black dark:text-white">History</span>

                  <span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {changes.length}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="dbindex"
                  class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>

                  <span class="flex-1 ml-3 whitespace-nowrap text-black dark:text-white">Define Index</span>
                </a>

                <ul id="dropdown-example" class="py-2 space-y-2">
                  {indexList.map((index: any, i: number) => (
                    // <li>
                    //   <a
                    //     href={`dbindex?id=${i}`}
                    //     class="flex font-light text-sm break-all font-mono items-center overflow-hidden w-full pl-11 p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700"
                    //   >
                    //     {index.name}
                    //   </a>
                    // </li>
                    <li>
                      <a
                        href={`dbindex?id=${i}`}
                        class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>

                        <span class="flex-1 ml-3 whitespace-nowrap font-mono text-sm text-black dark:text-gray-400">
                          {index.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* <li>
                <a
                  href="#"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                  </svg>
                  <span class="flex-1 ml-3 whitespace-nowrap">Replication</span>
                  <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    New
                  </span>
                </a>
              </li> */}

              <li>
                <a
                  href="sync"
                  class="flex items-center p-2 text-gray-500 transition duration-75 dark:text-gray-400 hover:dark:text-white hover:text-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>

                  <span class="flex-1 ml-3 whitespace-nowrap text-black dark:text-white">Live Sync</span>

                  <span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    ok
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}

// SidebarMenu.dbName = 'todomvc'
