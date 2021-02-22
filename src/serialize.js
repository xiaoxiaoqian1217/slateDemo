// Import the `Node` helper interface from Slate.
import React, { useMemo, useState } from "react";
import ReactDOM from 'react-dom';
import { Node } from "slate";
// Import the Slate editor factory.
import { createEditor } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
// Define a serializing function that takes a value and returns a string.


// react 的快速刷新机制
// @refresh reset
const serialize = (value) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => {
  console.log('%c  string:', 'color: #0e93e0;background: #aaefe5;', string);
  // Return a value array of children derived by splitting the string.
  return string.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

const SerializeCom = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  // Use our deserializing function to read the data from Local Storage.
  const data = localStorage.getItem("content")
  // 文本编辑器中的初始值都应该是一个对象，展示
  const [value, setValue] = useState(
    data && deserialize(data) || [
      {
        children: [
          {
            text: 'This is editable plain text!',
            // marks: []
          }
        ]
      }
    ]
  );

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          // Serialize the value and save the string value to Local Storage.
          localStorage.setItem("content", serialize(value));
        }}
      >
        <Editable />
      </Slate>
    </div>
  );
};
export default SerializeCom;
