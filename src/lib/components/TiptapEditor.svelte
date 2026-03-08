<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';

	let props: {
		content?: string;
		name: string;
		onupdate?: (html: string) => void;
	} = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | undefined>(undefined);
	// svelte-ignore state_referenced_locally — intentional: content is only used for initialization
	let internalHtml = $state(props.content || '');
	let hiddenValue = $derived(internalHtml);

	onMount(() => {
		const initialContent = props.content || '';
		internalHtml = initialContent;
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({
					heading: false,
					codeBlock: false,
					blockquote: false,
					horizontalRule: false,
					code: false
				}),
				Link.configure({ openOnClick: false })
			],
			content: initialContent,
			onTransaction: () => {
				// force Svelte reactivity
				editor = editor;
			},
			onUpdate: ({ editor: e }) => {
				internalHtml = e.getHTML();
				props.onupdate?.(internalHtml);
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div class="tiptap-wrapper border border-slate-200 rounded-md overflow-hidden focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-amber-100">
	<div class="tiptap-toolbar flex gap-1 p-2 bg-slate-50 border-b border-slate-200">
		{#if editor}
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200 {editor.isActive('bold') ? 'bg-slate-200 font-bold' : ''}"
				onclick={() => editor?.chain().focus().toggleBold().run()}
			>B</button>
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200 italic {editor.isActive('italic') ? 'bg-slate-200' : ''}"
				onclick={() => editor?.chain().focus().toggleItalic().run()}
			>I</button>
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200 {editor.isActive('bulletList') ? 'bg-slate-200' : ''}"
				onclick={() => editor?.chain().focus().toggleBulletList().run()}
			>List</button>
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200 {editor.isActive('orderedList') ? 'bg-slate-200' : ''}"
				onclick={() => editor?.chain().focus().toggleOrderedList().run()}
			>1. List</button>
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200 {editor.isActive('link') ? 'bg-slate-200' : ''}"
				onclick={() => {
					if (editor?.isActive('link')) {
						editor.chain().focus().unsetLink().run();
					} else {
						const url = prompt('Enter URL:');
						if (url) editor?.chain().focus().setLink({ href: url }).run();
					}
				}}
			>Link</button>
			<button
				type="button"
				class="px-2 py-1 rounded text-sm hover:bg-slate-200"
				onclick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
			>Clear</button>
		{/if}
	</div>
	<div bind:this={element} class="tiptap-content prose max-w-none p-3 min-h-[120px] text-sm focus:outline-none"></div>
</div>
<input type="hidden" name={props.name} value={hiddenValue} />

<style>
	:global(.tiptap-content .tiptap) {
		outline: none;
		min-height: 100px;
	}
	:global(.tiptap-content .tiptap p) {
		margin: 0.25rem 0;
	}
	:global(.tiptap-content .tiptap ul, .tiptap-content .tiptap ol) {
		padding-left: 1.25rem;
	}
</style>
