<script lang="ts">
	import { enhance } from '$app/forms';
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';

	let { data, form } = $props();
	let { profile, workExperiences, freelanceWorks, educations, todos } = data;

	let openSection = $state<string | null>('profile');

	function toggle(section: string) {
		openSection = openSection === section ? null : section;
	}
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

{#if form?.message}
	<div class="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-4 text-sm text-emerald-800">
		{form.message}
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
						<input type="text" id="full_name" name="full_name" value={profile?.full_name || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="prof_title" class="block text-sm font-semibold text-slate-600 mb-1">Title</label>
						<input type="text" id="prof_title" name="title" value={profile?.title || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="location" class="block text-sm font-semibold text-slate-600 mb-1">Location</label>
						<input type="text" id="location" name="location" value={profile?.location || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="nationality" class="block text-sm font-semibold text-slate-600 mb-1">Nationality</label>
						<input type="text" id="nationality" name="nationality" value={profile?.nationality || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="seeking_role" class="block text-sm font-semibold text-slate-600 mb-1">Seeking Role</label>
						<input type="text" id="seeking_role" name="seeking_role" value={profile?.seeking_role || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<div>
						<label for="freelance_status" class="block text-sm font-semibold text-slate-600 mb-1">Freelance Status</label>
						<select id="freelance_status" name="freelance_status" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100">
							<option value="not_accepting" selected={profile?.freelance_status !== 'accepting'}>Not Accepting</option>
							<option value="accepting" selected={profile?.freelance_status === 'accepting'}>Accepting</option>
						</select>
					</div>
				</div>
				<div>
					<label class="block text-sm font-semibold text-slate-600 mb-1">Summary</label>
					<TiptapEditor name="summary" content={profile?.summary || ''} />
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
		Work Experience ({workExperiences.length})
		<span class="text-slate-400 text-sm">{openSection === 'work' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'work'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each workExperiences as exp}
				<div class="border border-slate-100 rounded-lg p-4 mt-4">
					<form method="POST" action="?/saveWorkExperience" use:enhance class="space-y-3">
						<input type="hidden" name="doc_id" value={exp.$id} />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
								<input type="text" name="jobtitle" value={exp.jobtitle} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Employer</label>
								<input type="text" name="employer" value={exp.employer} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Location</label>
								<input type="text" name="location" value={exp.location || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
									<input type="text" name="start_date" value={exp.start_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
								<div>
									<label class="block text-xs font-semibold text-slate-600 mb-1">End</label>
									<input type="text" name="end_date" value={exp.end_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
							</div>
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
							<TiptapEditor name="description" content={exp.description || ''} />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
							<input type="number" name="sort_order" value={exp.sort_order || 0} class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
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
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
							<input type="text" name="jobtitle" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Employer</label>
							<input type="text" name="employer" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Location</label>
							<input type="text" name="location" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
								<input type="text" name="start_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">End</label>
								<input type="text" name="end_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
						<TiptapEditor name="description" content="" />
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
						<input type="number" name="sort_order" value="0" class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
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
		Freelance Work ({freelanceWorks.length})
		<span class="text-slate-400 text-sm">{openSection === 'freelance' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'freelance'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each freelanceWorks as work}
				<div class="border border-slate-100 rounded-lg p-4 mt-4">
					<form method="POST" action="?/saveFreelanceWork" use:enhance class="space-y-3">
						<input type="hidden" name="doc_id" value={work.$id} />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Project Name</label>
								<input type="text" name="project_name" value={work.project_name} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Client Name</label>
								<input type="text" name="client_name" value={work.client_name || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
							<TiptapEditor name="description" content={work.description || ''} />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Testimonial</label>
							<textarea name="testimonial" rows="2" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100">{work.testimonial || ''}</textarea>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Portfolio URL</label>
								<input type="url" name="portfolio_url" value={work.portfolio_url || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
								<input type="number" name="sort_order" value={work.sort_order || 0} class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
						<div class="flex gap-2">
							<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Save</button>
						</div>
					</form>
					<form method="POST" action="?/deleteFreelanceWork" use:enhance class="mt-2">
						<input type="hidden" name="doc_id" value={work.$id} />
						<button type="submit" class="text-red-500 hover:text-red-700 text-xs" onclick={(e) => { if (!confirm('Delete this entry?')) e.preventDefault(); }}>Delete</button>
					</form>
				</div>
			{/each}

			<details class="mt-4">
				<summary class="cursor-pointer text-sm text-[var(--color-accent)] hover:text-amber-700 font-semibold">+ Add Freelance Work</summary>
				<form method="POST" action="?/saveFreelanceWork" use:enhance class="space-y-3 mt-3 border border-slate-100 rounded-lg p-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Project Name</label>
							<input type="text" name="project_name" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Client Name</label>
							<input type="text" name="client_name" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Description</label>
						<TiptapEditor name="description" content="" />
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Testimonial</label>
						<textarea name="testimonial" rows="2" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100"></textarea>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Portfolio URL</label>
							<input type="url" name="portfolio_url" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
							<input type="number" name="sort_order" value="0" class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Add</button>
				</form>
			</details>
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
		Education ({educations.length})
		<span class="text-slate-400 text-sm">{openSection === 'education' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'education'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each educations as edu}
				<div class="border border-slate-100 rounded-lg p-4 mt-4">
					<form method="POST" action="?/saveEducation" use:enhance class="space-y-3">
						<input type="hidden" name="doc_id" value={edu.$id} />
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
								<input type="text" name="degree" value={edu.degree} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">University</label>
								<input type="text" name="university" value={edu.university} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Majors</label>
								<input type="text" name="majors" value={edu.majors || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
									<input type="text" name="start_date" value={edu.start_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
								<div>
									<label class="block text-xs font-semibold text-slate-600 mb-1">End</label>
									<input type="text" name="end_date" value={edu.end_date || ''} class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
								</div>
							</div>
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Details</label>
							<TiptapEditor name="details" content={edu.details || ''} />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
							<input type="number" name="sort_order" value={edu.sort_order || 0} class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
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
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
							<input type="text" name="degree" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">University</label>
							<input type="text" name="university" required class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div>
							<label class="block text-xs font-semibold text-slate-600 mb-1">Majors</label>
							<input type="text" name="majors" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">Start</label>
								<input type="text" name="start_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
							<div>
								<label class="block text-xs font-semibold text-slate-600 mb-1">End</label>
								<input type="text" name="end_date" class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
							</div>
						</div>
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Details</label>
						<TiptapEditor name="details" content="" />
					</div>
					<div>
						<label class="block text-xs font-semibold text-slate-600 mb-1">Sort Order</label>
						<input type="number" name="sort_order" value="0" class="w-20 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
					</div>
					<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Add</button>
				</form>
			</details>
		</div>
	{/if}
</div>

<!-- Todos Section -->
<div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
	<button
		type="button"
		class="w-full text-left px-6 py-4 font-semibold text-[var(--color-navy)] flex justify-between items-center hover:bg-slate-50"
		onclick={() => toggle('todos')}
	>
		Todos ({todos.length})
		<span class="text-slate-400 text-sm">{openSection === 'todos' ? '−' : '+'}</span>
	</button>
	{#if openSection === 'todos'}
		<div class="px-6 pb-6 border-t border-slate-100">
			{#each todos as todo}
				<div class="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0">
					<form method="POST" action="?/toggleTodo" use:enhance class="flex items-center">
						<input type="hidden" name="doc_id" value={todo.$id} />
						<input type="hidden" name="completed" value={String(todo.completed)} />
						<button type="submit" class="w-5 h-5 rounded border border-slate-300 flex items-center justify-center hover:border-[var(--color-accent)] {todo.completed ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' : ''}">
							{#if todo.completed}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
							{/if}
						</button>
					</form>
					<span class="flex-1 text-sm {todo.completed ? 'line-through text-slate-400' : ''}">{todo.title}</span>
					<form method="POST" action="?/deleteTodo" use:enhance>
						<input type="hidden" name="doc_id" value={todo.$id} />
						<button type="submit" class="text-red-400 hover:text-red-600 text-xs">x</button>
					</form>
				</div>
			{/each}

			<form method="POST" action="?/saveTodo" use:enhance class="flex gap-2 mt-4">
				<input type="text" name="title" required placeholder="New todo..." class="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100" />
				<input type="hidden" name="sort_order" value={todos.length} />
				<button type="submit" class="bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">Add</button>
			</form>
		</div>
	{/if}
</div>
