<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let props: {
		content?: string;
		name: string;
	} = $props();

	let element: HTMLTextAreaElement;
	let editorInstance: any;
	let internalValue = $state(props.content || '');

	onMount(async () => {
		const EasyMDE = (await import('easymde')).default;
		editorInstance = new EasyMDE({
			element,
			initialValue: props.content || '',
			spellChecker: false,
			status: false,
			toolbar: ['bold', 'italic', '|', 'unordered-list', 'ordered-list', '|', 'link', '|', 'preview'],
			minHeight: '120px'
		});
		editorInstance.codemirror.on('change', () => {
			internalValue = editorInstance.value();
		});
	});

	onDestroy(() => {
		editorInstance?.toTextArea();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css" />
</svelte:head>

<textarea bind:this={element}></textarea>
<input type="hidden" name={props.name} value={internalValue} />

<style>
	:global(.EasyMDEContainer .CodeMirror) {
		border-color: #e2e8f0;
		border-radius: 0 0 0.375rem 0.375rem;
		font-size: 0.875rem;
	}
	:global(.EasyMDEContainer .editor-toolbar) {
		border-color: #e2e8f0;
		border-radius: 0.375rem 0.375rem 0 0;
	}
	:global(.EasyMDEContainer .editor-toolbar button.active,
	.EasyMDEContainer .editor-toolbar button:hover) {
		background: #f1f5f9;
		border-color: #e2e8f0;
	}
</style>
