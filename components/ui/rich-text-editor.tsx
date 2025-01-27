"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "./button"
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Link as LinkIcon,
	Quote,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface RichTextEditorProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

export function RichTextEditor({
	value,
	onChange,
	placeholder = "Enter your content here...",
	className,
}: RichTextEditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "list-disc list-outside ml-4",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal list-outside ml-4",
					},
				},
				blockquote: {
					HTMLAttributes: {
						class: "border-l-2 border-muted pl-4 italic",
					},
				},
			}),
			Link.configure({
				HTMLAttributes: {
					class: "text-primary underline",
				},
			}),
			Placeholder.configure({
				placeholder,
				emptyEditorClass:
					"before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none",
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-3 focus:outline-none",
					className
				),
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
	})

	useEffect(() => {
		if (editor) {
			editor.commands.setContent(value, false, {
				preserveWhitespace: 'full',
			})
		}
	}, [value, editor]);

	if (!editor) {
		return null
	}

	const addLink = () => {
		const url = window.prompt("URL")
		if (url) {
			editor.chain().focus().setLink({ href: url }).run()
		}
	}

	return (
		<div className="rounded-md border">
			<div className="flex flex-wrap gap-1 border-b bg-muted/50 p-1">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={cn(editor.isActive("bold") && "bg-muted")}
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={cn(editor.isActive("italic") && "bg-muted")}
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={cn(editor.isActive("bulletList") && "bg-muted")}
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={cn(editor.isActive("orderedList") && "bg-muted")}
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={cn(editor.isActive("blockquote") && "bg-muted")}
				>
					<Quote className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={addLink}
					className={cn(editor.isActive("link") && "bg-muted")}
				>
					<LinkIcon className="h-4 w-4" />
				</Button>
			</div>
			<EditorContent editor={editor} />
		</div>
	)
} 