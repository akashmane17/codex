import { Editor, OnMount } from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";
import { CODE_SNIPPETS } from "../constants/Action";
import useSocketClient from "../hooks/useSocketClient";
import { useNavigate } from "react-router-dom";

interface Props {
  roomId: string | undefined;
  username: string;
}

const CodeEditor: React.FC<Props> = ({ roomId, username }) => {
  const editorRef = useRef<any>(null);
  const [language, setLanguage] = useState<string>("javascript");

  const { socket } = useSocketClient();
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const onMount: OnMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: string) => {
    setLanguage(language);
    setCode(CODE_SNIPPETS[language] || "");
  };

  function handleCodeChange(value: string) {
    setCode(value);
    if (socket && roomId) {
      socket.emit("code-change", {
        roomId,
        code: value,
      });
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("connect_error", (err) => handleErrors(err));
      socket.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e: any) {
        console.log("socket error", e);
        // toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      // connect to the room with roomId or create room
      socket.emit("join", {
        roomId,
        username,
      });

      socket.on("joined", ({ roomId }: any) => {
        console.log("Code syncing...");
        socket.emit("code-sync", {
          // code: code,
          roomId,
        });
      });

      socket.on("code-change", ({ code }) => {
        console.log("Code: ", code);
        if (code !== null) {
          setCode(code);
        }
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off("code-change");
        socket.off("joined");
      }
    };
  }, [socket]);

  return (
    <div>
      <div>
        <div>
          {/* <LanguageSelector language={language} onSelect={onSelect} /> */}

          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="calc(100vh - 53px)"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            value={code}
            onChange={(value) => handleCodeChange(value || "")}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
