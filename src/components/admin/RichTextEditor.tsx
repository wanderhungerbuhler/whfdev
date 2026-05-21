'use client'

import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function plainTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('')
}

function normalizeInitial(value: string): string {
  if (!value) return ''
  return /<\/?[a-z][\s\S]*>/i.test(value) ? value : plainTextToHtml(value)
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
          class: 'text-coral underline underline-offset-2',
        },
      }),
    ],
    content: normalizeInitial(value),
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm max-w-none min-h-[160px] rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink focus:border-coral focus:ring-2 focus:ring-coral/30 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    immediatelyRender: false,
  })

  // Sync external value changes (e.g. after Save draft refresh) without
  // clobbering the user's caret during normal typing.
  useEffect(() => {
    if (!editor) return
    const incoming = normalizeInitial(value)
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  if (!editor) {
    return (
      <div className="min-h-[160px] rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink-muted">
        {placeholder ?? 'Carregando editor…'}
      </div>
    )
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL do link', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-rule-soft bg-canvas-elev px-2 py-1.5">
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito (⌘B)"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico (⌘I)"
        >
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Riscado"
        >
          <span className="line-through">S</span>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista"
        >
          •
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          1.
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          active={editor.isActive('link')}
          onClick={setLink}
          title="Link"
        >
          🔗
        </ToolbarBtn>
        {editor.isActive('link') && (
          <ToolbarBtn
            active={false}
            onClick={() =>
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }
            title="Remover link"
          >
            ⨯
          </ToolbarBtn>
        )}
        <div className="ml-auto" />
        <ToolbarBtn
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          title="Desfazer"
        >
          ↶
        </ToolbarBtn>
        <ToolbarBtn
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          title="Refazer"
        >
          ↷
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-xs transition ${
        active
          ? 'bg-coral text-white'
          : 'text-ink-soft hover:bg-canvas hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-0.5 h-4 w-px bg-rule-soft" />
}
