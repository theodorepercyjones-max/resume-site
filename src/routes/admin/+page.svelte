<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';

	let { data, form } = $props();

	let openSection = $state<string | null>('profile');
	let toastMessage = $state('');
	let toastSuccess = $state(true);
	let toastVisible = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;

	function showToast(message: string, success: boolean) {
		toastMessage = message;
		toastSuccess = success;
		toastVisible = true;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => { toastVisible = false; }, 3500);
	}

	$effect(() => {
		if (form?.message) {
			showToast(form.message, form.success ?? false);
		}
	});

	function toggle(section: string) {
		openSection = openSection === section ? null : section;
	}
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<!-- Toast notification -->
{#if toastVisible}
	<div class="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all {toastSuccess ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}">
		<div class="flex items-center gap-2">
			<span class="flex-1">{toastMessage}</span>
			<button type="button" class="opacity-70 hover:opacity-100" onclick={() => toastVisible = false}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
			</button>
		</div>
	</div>
{/if}

<!-- Profile Section -->
<div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
	<button
		type="button"
		class="w-full text-left px-6 py-4 font-semibold text-[var(--color-navy)] flex justify-between items-center hover:bg-slate-50"
		onclick={() => toggle('profile')}
	>
		Profile
		<span class="text-slate-400 text-sm">{openSection === 'profile' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'profile'}
		<div class="px-6 pb-6 border-t border-slate-100">
			<form method="POST" action="?/updateProfile" use:enhance class="space-y-4 mt-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="full_name" class="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
						<input type="text" id="full_name" name="full_name" value={data.profile?.full_name || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="prof_title" class="block text-sm font-semibold text-slate-600 mb-1">Title</label>
						<input type="text" id="prof_title" name="title" value={data.profile?.title || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="prof_location" class="block text-sm font-semibold text-slate-600 mb-1">Location</label>
						<input type="text" id="prof_location" name="location" value={data.profile?.location || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="nationality" class="block text-sm font-semibold text-slate-600 mb-1">Nationality</label>
						<input type="text" id="nationality" name="nationality" value={data.profile?.nationality || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="seeking_role" class="block text-sm font-semibold text-slate-600 mb-1">Desired Employment Type</label>
						<input type="text" id="seeking_role" name="seeking_role" value={data.profile?.seeking_role || ''} placeholder="e.g. Full Time W2, Contract, Part Time" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="freelance_status" class="block text-sm font-semibold text-slate-600 mb-1">Freelance Status</label>
						<select id="freelance_status" name="freelance_status" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100">
							<option value="not_accepting" selected={data.profile?.freelance_status !== 'accepting'}>Not Accepting</option>
							<option value="accepting" selected={data.profile?.freelance_status === 'accepting'}>Accepting</option>
						</select>
					</div>
				</div>
				<div class="md:col-span-2">
					<label for="source_code_url" class="block text-sm font-semibold text-slate-600 mb-1">Source Code URL</label>
					<input type="url" id="source_code_url" name="source_code_url" value={data.profile?.source_code_url || ''} placeholder="e.g. https://github.com/user/repo" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
				</div>
				<div>
					<span class="block text-sm font-semibold text-slate-600 mb-1">Summary</span>
					<MarkdownEditor name="summary" content={data.profile?.summary || ''} />
				</div>
				<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors">Save Profile</button>
			</form>
		</div>
	{/if}
</div>

<!-- Work Experience Section -->
<div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
	<button
		type="button"
		class="w-full text-left px-6 py-4 font-semibold text-[var(--color-navy)] flex justify-between items-center hover:bg-slate-50"
		onclick={() => toggle('work')}
	>
		Work Experience ({data.workExperiences.length})
		<span class="text-slate-400 text-sm">{openSection === 'work' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'work'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each data.workExperiences as exp, i (exp.$id)}
				<div class="border border-slate-100 rounded-lg p-4 mt-4">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs text-slate-400">#{i + 1}</span>
						<div class="flex gap-1">
							{#if i > 0}
								<form method="POST" action="?/moveWorkExperience" use:enhance>
									<input type="hidden" name="doc_id" value={exp.$id} />
									<input type="hidden" name="direction" value="up" />
									<button type="submit" class="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Move up">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
									</button>
								</form>
							{/if}
							{#if i < data.workExperiences.length - 1}
								<form method="POST" action="?/moveWorkExperience" use:enhance>
									<input type="hidden" name="doc_id" value={exp.$id} />
									<input type="hidden" name="direction" value="down" />
									<button type="submit" class="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Move down">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
									</button>
								</form>
							{/if}
						</div>
					</div>
					<form method="POST" action="?/saveWorkExperience" use:enhance class="space-y-3">
						<input type="hidden" name="doc_id" value={exp.$id} />
						<input type="hidden" name="sort_order" value={exp.sort_order ?? i} />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label for="we-jobtitle-{exp.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
								<input type="text" id="we-jobtitle-{exp.$id}" name="jobtitle" value={exp.jobtitle} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="we-employer-{exp.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Employer</label>
								<input type="text" id="we-employer-{exp.$id}" name="employer" value={exp.employer} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="we-location-{exp.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Location</label>
								<input type="text" id="we-location-{exp.$id}" name="location" value={exp.location || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label for="we-start-{exp.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
									<input type="text" id="we-start-{exp.$id}" name="start_date" value={exp.start_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
								<div>
									<label for="we-end-{exp.$id}" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
									<input type="text" id="we-end-{exp.$id}" name="end_date" value={exp.end_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
							</div>
						</div>
						<div>
							<span class="block text-xs font-semibold text-slate-600 mb-1">Description</span>
							<MarkdownEditor name="description" content={exp.description || ''} />
						</div>
						<div class="flex gap-2">
							<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Save</button>
						</div>
					</form>
					<form method="POST" action="?/deleteWorkExperience" use:enhance class="mt-2">
						<input type="hidden" name="doc_id" value={exp.$id} />
						<button type="submit" class="text-red-500 hover:text-red-700 text-xs" onclick={(e) => { if (!confirm('Delete this entry?')) e.preventDefault(); }}>Delete</button>
					</form>
				</div>
			{/each}

			<!-- New Work Experience -->
			<details class="mt-4">
				<summary class="cursor-pointer text-sm text-[var(--color-accent)] hover:text-amber-700 font-semibold">+ Add Work Experience</summary>
				<form method="POST" action="?/saveWorkExperience" use:enhance class="space-y-3 mt-3 border border-slate-100 rounded-lg p-4">
					<input type="hidden" name="sort_order" value={data.workExperiences.length} />
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label for="new-we-jobtitle" class="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
							<input type="text" id="new-we-jobtitle" name="jobtitle" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="new-we-employer" class="block text-xs font-semibold text-slate-600 mb-1">Employer</label>
							<input type="text" id="new-we-employer" name="employer" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="new-we-location" class="block text-xs font-semibold text-slate-600 mb-1">Location</label>
							<input type="text" id="new-we-location" name="location" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label for="new-we-start" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
								<input type="text" id="new-we-start" name="start_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="new-we-end" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
								<input type="text" id="new-we-end" name="end_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
					</div>
					<div>
						<span class="block text-xs font-semibold text-slate-600 mb-1">Description</span>
						<MarkdownEditor name="description" content="" />
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Add</button>
				</form>
			</details>
		</div>
	{/if}
</div>

<!-- Freelance Work Section -->
<div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
	<button
		type="button"
		class="w-full text-left px-6 py-4 font-semibold text-[var(--color-navy)] flex justify-between items-center hover:bg-slate-50"
		onclick={() => toggle('freelance')}
	>
		Freelance Work
		<span class="text-slate-400 text-sm">{openSection === 'freelance' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'freelance'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#if data.freelanceWorks.length > 0}
				{@const work = data.freelanceWorks[0]}
				<form method="POST" action="?/saveFreelanceWork" use:enhance class="space-y-4 mt-4">
					<input type="hidden" name="doc_id" value={work.$id} />
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="fw-start" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
							<input type="text" id="fw-start" name="start_date" value={work.start_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="fw-end" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
							<input type="text" id="fw-end" name="end_date" value={work.end_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
					</div>
					<div>
						<span class="block text-xs font-semibold text-slate-600 mb-1">Description</span>
						<MarkdownEditor name="description" content={work.description || ''} />
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors">Save Freelance Work</button>
				</form>
			{:else}
				<form method="POST" action="?/saveFreelanceWork" use:enhance class="space-y-4 mt-4">
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="fw-start" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
							<input type="text" id="fw-start" name="start_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="fw-end" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
							<input type="text" id="fw-end" name="end_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
					</div>
					<div>
						<span class="block text-xs font-semibold text-slate-600 mb-1">Description</span>
						<MarkdownEditor name="description" content="" />
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-md text-sm transition-colors">Save Freelance Work</button>
				</form>
			{/if}
		</div>
	{/if}
</div>

<!-- Education Section -->
<div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
	<button
		type="button"
		class="w-full text-left px-6 py-4 font-semibold text-[var(--color-navy)] flex justify-between items-center hover:bg-slate-50"
		onclick={() => toggle('education')}
	>
		Education ({data.educations.length})
		<span class="text-slate-400 text-sm">{openSection === 'education' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'education'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each data.educations as edu, i (edu.$id)}
				<div class="border border-slate-100 rounded-lg p-4 mt-4">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs text-slate-400">#{i + 1}</span>
						<div class="flex gap-1">
							{#if i > 0}
								<form method="POST" action="?/moveEducation" use:enhance>
									<input type="hidden" name="doc_id" value={edu.$id} />
									<input type="hidden" name="direction" value="up" />
									<button type="submit" class="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Move up">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
									</button>
								</form>
							{/if}
							{#if i < data.educations.length - 1}
								<form method="POST" action="?/moveEducation" use:enhance>
									<input type="hidden" name="doc_id" value={edu.$id} />
									<input type="hidden" name="direction" value="down" />
									<button type="submit" class="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Move down">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
									</button>
								</form>
							{/if}
						</div>
					</div>
					<form method="POST" action="?/saveEducation" use:enhance class="space-y-3">
						<input type="hidden" name="doc_id" value={edu.$id} />
						<input type="hidden" name="sort_order" value={edu.sort_order ?? i} />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label for="edu-degree-{edu.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
								<input type="text" id="edu-degree-{edu.$id}" name="degree" value={edu.degree} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="edu-uni-{edu.$id}" class="block text-xs font-semibold text-slate-600 mb-1">University</label>
								<input type="text" id="edu-uni-{edu.$id}" name="university" value={edu.university} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="edu-majors-{edu.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Majors</label>
								<input type="text" id="edu-majors-{edu.$id}" name="majors" value={edu.majors || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label for="edu-start-{edu.$id}" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
									<input type="text" id="edu-start-{edu.$id}" name="start_date" value={edu.start_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
								<div>
									<label for="edu-end-{edu.$id}" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
									<input type="text" id="edu-end-{edu.$id}" name="end_date" value={edu.end_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
							</div>
						</div>
						<div>
							<span class="block text-xs font-semibold text-slate-600 mb-1">Details</span>
							<MarkdownEditor name="details" content={edu.details || ''} />
						</div>
						<div class="flex gap-2">
							<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Save</button>
						</div>
					</form>
					<form method="POST" action="?/deleteEducation" use:enhance class="mt-2">
						<input type="hidden" name="doc_id" value={edu.$id} />
						<button type="submit" class="text-red-500 hover:text-red-700 text-xs" onclick={(e) => { if (!confirm('Delete this entry?')) e.preventDefault(); }}>Delete</button>
					</form>
				</div>
			{/each}

			<details class="mt-4">
				<summary class="cursor-pointer text-sm text-[var(--color-accent)] hover:text-amber-700 font-semibold">+ Add Education</summary>
				<form method="POST" action="?/saveEducation" use:enhance class="space-y-3 mt-3 border border-slate-100 rounded-lg p-4">
					<input type="hidden" name="sort_order" value={data.educations.length} />
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label for="new-edu-degree" class="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
							<input type="text" id="new-edu-degree" name="degree" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="new-edu-uni" class="block text-xs font-semibold text-slate-600 mb-1">University</label>
							<input type="text" id="new-edu-uni" name="university" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label for="new-edu-majors" class="block text-xs font-semibold text-slate-600 mb-1">Majors</label>
							<input type="text" id="new-edu-majors" name="majors" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label for="new-edu-start" class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
								<input type="text" id="new-edu-start" name="start_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label for="new-edu-end" class="block text-xs font-semibold text-slate-600 mb-1">End</label>
								<input type="text" id="new-edu-end" name="end_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
					</div>
					<div>
						<span class="block text-xs font-semibold text-slate-600 mb-1">Details</span>
						<MarkdownEditor name="details" content="" />
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Add</button>
				</form>
			</details>
		</div>
	{/if}
</div>

