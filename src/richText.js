import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Editor, Transforms, Text  } from 'slate'
import { withHistory } from 'slate-history'

import PropTypes from 'prop-types'
// @refresh reset

const RichText = props => {
  // withReact 将react 和 dom 的特定行为添加到编辑器
  // useMemo 第二个参数是空数组，则只执行一次，类似于 componentDidMount, useEffect
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState([{
    children: [
      { text: 'This is editable plain text, just like a <textarea>!' },
    ],
  },])
  // 渲染文本
  // const renderLeaf = useCallback(props => {
  //   return <Leaf {...props} />
  // }, [])
  return (
    <div>
      <Slate
        editor = {editor}
        value={value}
        // renderLeaf = {renderLeaf}
        onChange={newValue => setValue(newValue)}
      >
        <Editable placeholder="Enter some rich text…"></Editable>
      </Slate>
    </div>
  )
}

RichText.propTypes = {

}

export default RichText
