"use client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
export default function CodeEditorWindow({ children, output, scenario }) {
  const [code, setCode] = useState(output);
  return (
    <ScrollArea className="h-[calc(100vh-140px)] pr-3 border">
      <CodeEditor
        value={code}
        language="cpp"
        placeholder="Please enter code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </ScrollArea>
  );
}
