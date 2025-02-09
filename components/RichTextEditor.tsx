'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl,
  FaQuoteRight,
  FaLink,
  FaUnlink,
  FaHeading
} from 'react-icons/fa'

// Özel kısayol extension'ı
const ShortcutExtension = Extension.create({
  name: 'shortcut',
  addKeyboardShortcuts() {
    return {
      'Space': () => {
        const { selection, doc } = this.editor.state
        const { from } = selection
        const textBefore = doc.textBetween(Math.max(0, from - 2), from)

        if (textBefore === '/b') {
          this.editor
            .chain()
            .deleteRange({ from: from - 2, to: from })
            .toggleBold()
            .run()
          return true
        }

        if (textBefore === '/i') {
          this.editor
            .chain()
            .deleteRange({ from: from - 2, to: from })
            .toggleItalic()
            .run()
          return true
        }

        if (textBefore === '/u') {
          this.editor
            .chain()
            .deleteRange({ from: from - 2, to: from })
            .toggleUnderline()
            .run()
          return true
        }

        return false
      }
    }
  }
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const RichTextEditor = ({ content = '', onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      ShortcutExtension,  // Kısayol extension'ını ekle
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer'
        }
      })
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none max-w-none min-h-[200px] max-h-[400px] overflow-y-auto',
      },
    },
  })

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full border rounded-lg">
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('bold') ? 'bg-muted' : ''
            }`}
          >
            <FaBold className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('italic') ? 'bg-muted' : ''
            }`}
          >
            <FaItalic className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('underline') ? 'bg-muted' : ''
            }`}
          >
            <FaUnderline className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''
            }`}
          >
            <FaHeading className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('bulletList') ? 'bg-muted' : ''
            }`}
          >
            <FaListUl className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('orderedList') ? 'bg-muted' : ''
            }`}
          >
            <FaListOl className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('blockquote') ? 'bg-muted' : ''
            }`}
          >
            <FaQuoteRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-muted ${
              editor.isActive('link') ? 'bg-muted' : ''
            }`}
          >
            <FaLink className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-muted"
            disabled={!editor.isActive('link')}
          >
            <FaUnlink className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <input
            type="color"
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
            }}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-8 h-8 p-0 rounded cursor-pointer bg-background"
          />
        </div>
      </div>

      <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] focus:outline-none"
        />
      </div>
    </div>
  )
}

export default RichTextEditor 