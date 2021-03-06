import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { createEditor, Editor, Transforms, Text, Element as SlateElement  } from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './component'
// @refresh reset

// 编辑器初始数据
const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

const LIST_TYPES = ['numbered-list', 'bulleted-list']

// 文本节点数据
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

// 文本按钮组件, format 是传入的prop
const MarkButton = ({ format, icon }) => {
  // 共享编辑器对象
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

// 当前活跃的文本标记属性
const isMarkActive = (editor, format) => {
  // 获取当前焦点所在位置的文本属性
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

// 设置当前富文本的格式， 可以设置多个
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)
  console.log('isActive', isActive)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// 元素按钮组件
const BlockButton = ( { format, icon }) => {
  // 共享编辑器对象
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBoldMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

// 当前活跃的元素标记属性
const isBlockActive = (editor, format) => {
  // 获取当前的元素节点
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })
  return !!match
}
// 设置当前选中的节点的数据
const toggleBoldMark = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)
  // 拆分节点
  Transforms.unwrapNodes(editor, {
    match: n => {
      return  LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      )
    },
    split: true,
  })
  // paragraph 表示的是默认的 文本样式 
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  console.log('newProperties', newProperties, isActive)
  Transforms.setNodes(editor, newProperties)
  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}


// 元素节点数据
const Element = ({ attributes, children, element }) => {
  switch(element.type){
    case 'block-quote': 
    return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}
const RichText = props => {
  // withReact 将react 和 dom 的特定行为添加到编辑器
  // useMemo 第二个参数是空数组，则只执行一次，类似于 componentDidMount, useEffect
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState(initialValue)

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])
  const renderElement = useCallback(props => {
    console.log('%c  renderElement:', 'color: #0e93e0;background: #aaefe5;', 'renderElement');
    return <Element {...props}/>
  }, [])

  return (
    <div>
      <Slate
        editor = {editor}
        value={value}
        onChange={newValue => setValue(newValue)}
      >
        <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
        <Editable
          renderElement = {renderElement}
          renderLeaf = {renderLeaf}
          autoFocus
          placeholder="Enter some rich text…"
        ></Editable>
      </Slate>
    </div>
  )
}

RichText.propTypes = {

}

export default RichText
