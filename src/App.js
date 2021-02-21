// Import React dependencies.
import React, { useEffect, useMemo, useState, useCallback } from 'react'
// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Text  } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
// Import the `Editor` and `Transforms` helpers from Slate.

import './App.css';
// @refresh reset
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>
        {/* 
          这里的 props.children 是一个虚拟的react Element
          props.children 获取的实际上就会死编辑器中的文本内容
        */}
          {props.children}
        </code>
    </pre>
  )
}

const DefaultElement = props => {

  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = props => {
  console.log('Leaf props', props)
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}
const App = () => {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), [])
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])
  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    console.log('props', props)
    // props.element.type 这里获取的是最底层dom元素
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])
  return (
    // 编辑器外头需要包裹一个div ，不然会报错
    // useCallback的快速刷新问题
    <div> 
      <Slate editor={editor}
        value={value}
        onChange={newValue => setValue(newValue)}
        >
        <Editable 
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
                  if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            // When "`" is pressed, keep our existing code block logic.
            case '`': {
              event.preventDefault()
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Editor.isBlock(editor, n) }
              )
              break
            }

            // When "B" is pressed, bold the text in the selection.
            case 'b': {
              event.preventDefault()
              Transforms.setNodes(
                editor,
                { bold: true },
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                { match: n => Text.isText(n), split: true }
              )
              break
            }
          }
        }}/>
      </Slate>
    </div>)
}

export default App
