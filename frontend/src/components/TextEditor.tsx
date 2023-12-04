// TextEditor.tsx
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent,
  onContentChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Quill | null>(null);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("your-upload-endpoint", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const url = data.imageUrl; // Adjust based on your API response

        if (editor) {
          const range = editor.getSelection(true);
          if (range) {
            editor.insertEmbed(range.index, "image", url);
          }
        }
      } catch (error) {
        console.error("Failed to upload image", error);
      }
    };
  };

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            // ... other toolbar options
            handlers: {
              image: imageHandler,
            },
          },
        },
      });

      quill.on("text-change", () => {
        onContentChange(quill.root.innerHTML);
      });

      if (initialContent) {
        quill.root.innerHTML = initialContent;
      }

      setEditor(quill);
    }
  }, [initialContent, onContentChange]);

  return <div ref={editorRef} />;
};

export default TextEditor;
