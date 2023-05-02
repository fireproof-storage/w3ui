//  @ ts-nocheck
import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import { CodeHighlight, EditableCodeHighlight } from './CodeHighlight'

// import { Sync } from '@fireproof/core'
import { Sync } from '../../../../../../fireproof/packages/fireproof/src/fireproof.js'

interface EditDocumentProps {}

export function ManageSync({}: EditDocumentProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [handshake, setHandshake] = useState<string>('')
  const [sync, setSync] = useState<Sync>()
  const [didInitiate, setDidInitiate] = useState(false)
  const [didAccept, setDidAccept] = useState(false)

  const id = window.location.search.split('id=').pop()
  // console.log('EditDocument', updateCount, theDocument)
  useEffect(() => {
    if (ready && database) {
      addSubscriber('EditDocument', () => {
        setUpdateCount(count => count + 1)
      })
    }
  }, [ready, database])
  // useEffect(() => {
  //   async function getDocument() {
  //     if (ready && database && id) {
  //       const theDoc = await database.get(id).catch((e: { message: string }) => {
  //         if (e.message !== 'Not found') throw e
  //         return { _id: id }
  //       })
  //       const { data } = docAndMeta(theDoc)
  //       const jsonDoc = JSON.stringify(data)
  //       setDocToSave(jsonDoc)
  //       setTheDocument(JSON.parse(JSON.stringify(theDoc)))
  //     }
  //   }
  //   getDocument()
  // }, [ready, database, updateCount])

  async function makeOffer() {
    console.log('makeOffer')
    const sync = new Sync(database)
    const offer = await sync.offer()
    setHandshake(offer)
    setDidInitiate(true)
    setSync(sync)
  }

  async function doAccept() {
    console.log('doAccept', handshake)
    const sync = new Sync(database)
    const accept = await sync.accept(handshake)
    setSync(sync)
    setHandshake(accept)
    setDidAccept(true)
  }

  async function doConnect() {
    console.log('doConnect', handshake)
    sync.connect(handshake)
    setHandshake("connected")
  }


  function editorChanged({ code, valid }) {
    setHandshake(code)
  }

  let action = 'Or paste to join'
  let btnLabel = 'Initiate'
  let onClick = () => makeOffer()
  if (didInitiate) {
    action = 'Share this with someone to invite them to sync'
    btnLabel = 'Connect'
    onClick = () => doConnect()

  } else if (handshake) {
    if (didAccept) {
      action = 'Share this with your inviter to sync'
      btnLabel = 'Copy'
    } else {
      btnLabel = 'Accept'
      action = 'Click accept to sync'
      onClick = () => doAccept()
    }
  }
  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">Configure Live Sync</h2>
      <button
        onClick={onClick}
        class={`${
          didAccept ? 'bg-gray-700 text-gray-400' : 'bg-blue-500 hover:bg-blue-700 text-white'
        }  font-bold py-2 px-4 m-5 rounded`}
      >
        {btnLabel}
      </button>
      <h3>{action}</h3>

      <EditableCodeHighlight onChange={editorChanged} code={handshake} theme={theme} />
      {/* <h3>Fireproof metadata</h3>
      <CodeHighlight code={JSON.stringify(idFirstMeta, null, 2)} theme={defaultProps.theme} /> */}
    </div>
  )
}

function docAndMeta(doc: { [x: string]: any }) {
  const data = {}
  const meta = {}
  Object.keys(doc).forEach((key: string) => {
    if (key.startsWith('_')) {
      meta[key] = doc[key]
    } else {
      data[key] = doc[key]
    }
  })
  return { data, meta }
}
