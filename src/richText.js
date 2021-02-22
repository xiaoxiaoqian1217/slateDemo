import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Editor, Transforms, Text  } from 'slate'

import PropTypes from 'prop-types'

const RichText = props => {
  // withReact 将react 和 dom 的特定行为添加到编辑器
  // useMemo 第二个参数是空数组，则只执行一次，类似于 componentDidMount, useEffect
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([{
    text: '简单的文本接口'
  }])
  return (
    <div>
      <Slate
        editor = {editor}
        value={value}
      >
        <Editable></Editable>
      </Slate>
    </div>
  )
}

RichText.propTypes = {

}

export default RichText
