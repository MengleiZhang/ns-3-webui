import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ns3ExecSync } from "@/components/system-call";
import CodeEditorWindow from "./code-editor";
import { CodeChat } from "./code-chat";

export function ResizableEditor({ scenario, children }) {
  const cmdLine = "cat $(find . -name " + scenario + ".cc)";
  const output = ns3ExecSync(cmdLine);

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <CodeEditorWindow output={output} scenario={scenario}>
            {children}
          </CodeEditorWindow>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <CodeChat output={output} scenario={scenario}>
            {children}
          </CodeChat>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
