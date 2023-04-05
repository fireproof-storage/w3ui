import React, { Fragment, useState, useEffect, useContext } from 'react'

// import { FireproofCtx, FireproofCtxValue } from '@fireproof/core/hooks/use-fireproof'
import { FireproofCtx, FireproofCtxValue } from '../../../../../../fireproof/packages/fireproof/hooks/use-fireproof'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

interface EditDocumentProps {}

export function EditDocument({}: EditDocumentProps): JSX.Element {
  const { ready, database, addSubscriber } = useContext(FireproofCtx) as FireproofCtxValue
  const [updateCount, setUpdateCount] = useState(0)
  const [theDocument, setTheDocument] = useState<any>({})
  const id = window.location.search.split('id=').pop()
  console.log('EditDocument', updateCount, theDocument)
  useEffect(() => {
    if (ready && database) {
      addSubscriber('EditDocument', () => {
        setUpdateCount(count => count + 1)
      })
    }
  }, [ready, database])
  useEffect(() => {
    async function getDocument() {
      if (ready && database) {
        const theDoc = await database.get(id) // with meta
        setTheDocument(JSON.parse(JSON.stringify(theDoc)))
      }
    }
    getDocument()
  }, [ready, database, updateCount])

  const docData = {}
  const docMeta = {}
  Object.keys(theDocument).forEach(key => {
    if (key.startsWith('_')) {
      docMeta[key] = theDocument[key]
    } else {
      docData[key] = theDocument[key]
    }
  })

  return (
    <div class={`bg-slate-800 p-6`}>
      <h2 class="text-2xl">_id: {theDocument._id}</h2>
      <h3>Document data</h3>
      <CodeHighlight data={docData} theme={theme} />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-5 rounded">Save</button>
      <h3>Metadata</h3>
      <CodeHighlight data={docMeta} theme={defaultProps.theme} />
    </div>
  )
}

function CodeHighlight({ data, theme }: any) {
  return (
    <div class="p-2">
      <Highlight {...defaultProps} className="p-6" theme={theme} code={JSON.stringify(data, null, 2)} language="json">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className+' p-2'} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
