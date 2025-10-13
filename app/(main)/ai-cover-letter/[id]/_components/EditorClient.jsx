// app/(main)/ai-cover-letter/[id]/_components/EditorClient.jsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import { useEffect, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditorClient({ initialContent, onSave }) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] p-6 focus:outline-none text-gray-900 leading-relaxed",
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
      setIsEditing(true);
    },
    onCreate() {
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
      setContent(initialContent);
      setIsEditing(false);
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bold")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("italic")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("underline")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bulletList")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("orderedList")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <EditorContent editor={editor} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isEditing}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>

        <Button
          onClick={handleSave}
          disabled={!isEditing}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Editing Indicator */}
      {isEditing && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
          <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
          You have unsaved changes
        </div>
      )}
    </div>
  );
}
