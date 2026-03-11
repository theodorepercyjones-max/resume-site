<script lang="ts">
	let { data } = $props();

	let fullName = $derived(data.profile?.full_name || 'Theodore Jones');
	let title = $derived(data.profile?.title || 'IT Professional');
	let location = $derived(data.profile?.location || 'Willow Grove, PA, USA');

	function parseDateApprox(s: string): number {
		const months: Record<string, number> = {
			jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11
		};
		const parts = s.trim().toLowerCase().split(/\s+/);
		const m = Object.entries(months).find(([k]) => parts[0]?.startsWith(k));
		const y = parseInt(parts[parts.length - 1]);
		return (!isNaN(y) && m) ? y * 12 + m[1] : -1;
	}

	let freelanceDateRange = $derived.by(() => {
		const starts: string[] = [];
		const ends: string[] = [];
		for (const w of data.freelanceWorks) {
			if (w.start_date) starts.push(w.start_date);
			if (w.end_date) ends.push(w.end_date);
		}
		if (starts.length === 0) return '';
		const earliest = starts.reduce((a, b) => parseDateApprox(a) <= parseDateApprox(b) ? a : b);
		const latest = ends.length > 0
			? ends.reduce((a, b) => parseDateApprox(a) >= parseDateApprox(b) ? a : b)
			: 'Present';
		return `${earliest} \u2013 ${latest}`;
	});

	let bridgeIndex = $derived.by(() => {
		if (!freelanceDateRange || data.freelanceWorks.length === 0) return -1;
		const allStarts = data.freelanceWorks
			.filter((w: any) => w.start_date)
			.map((w: any) => parseDateApprox(w.start_date));
		const freelanceStart = allStarts.length > 0 ? Math.min(...allStarts) : -1;
		if (freelanceStart === -1) return -1;

		for (let i = 0; i < data.workExperiences.length - 1; i++) {
			const exp = data.workExperiences[i];
			const endVal = exp.end_date ? parseDateApprox(exp.end_date) : -1;
			if (endVal !== -1 && endVal >= freelanceStart) {
				return i;
			}
		}
		return data.workExperiences.length > 1 ? 1 : -1;
	});
</script>

<svelte:head>
	<title>{fullName} - Resume</title>
</svelte:head>

<!-- Header -->
<header class="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] text-white py-12 pb-10 relative overflow-hidden">
	<div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]"></div>
	<div class="max-w-[860px] mx-auto px-6">
		<h1 class="font-[var(--font-serif)] text-4xl font-bold m-0">{fullName}</h1>
		<div class="text-slate-400 text-lg mt-1">{title}</div>
		<div class="flex flex-wrap gap-5 mt-4 text-sm text-slate-400">
			<span class="flex items-center gap-1.5">
				<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
				{location}
			</span>
		</div>
	</div>
</header>

<main class="max-w-[860px] mx-auto px-6 bg-[var(--color-cream)]">
	<!-- Professional Summary -->
	{#if data.profile?.summary}
		<section class="my-10">
			<div class="flex items-center gap-2 mb-5 pb-2 border-b-2 border-slate-200">
				<span class="w-1 h-6 bg-[var(--color-accent)] rounded-sm"></span>
				<h2 class="font-[var(--font-serif)] text-2xl text-[var(--color-navy)] m-0">Professional Summary</h2>
			</div>
			<div class="bg-white rounded-lg p-6 shadow-sm text-slate-700 leading-7 prose max-w-none">
				{@html data.profile.summary}
			</div>
			{#if data.profile?.nationality || data.profile?.seeking_role}
				<div class="flex flex-wrap gap-3 mt-4">
					{#if data.profile?.nationality}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
							<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
							{data.profile.nationality}
						</span>
					{/if}
					{#if data.profile?.seeking_role}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
							<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
							Seeking: {data.profile.seeking_role}
						</span>
					{/if}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Freelance Work -->
	{#if data.freelanceWorks.length > 0}
		{@const work = data.freelanceWorks[0]}
		<section class="my-10">
			<div class="flex items-center gap-2 mb-5 pb-2 border-b-2 border-slate-200">
				<span class="w-1 h-6 bg-[var(--color-accent)] rounded-sm"></span>
				<h2 class="font-[var(--font-serif)] text-2xl text-[var(--color-navy)] m-0">Freelance Work</h2>
				{#if work.start_date}
					<span class="ml-auto text-slate-400 text-xs whitespace-nowrap">
						{work.start_date}{#if work.end_date} &ndash; {work.end_date}{:else} &ndash; Present{/if}
					</span>
				{/if}
			</div>

			{#if data.profile?.freelance_status === 'not_accepting'}
				<div class="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-5 text-sm text-amber-800">
					Not currently accepting new freelance clients.
				</div>
			{:else if data.profile?.freelance_status === 'accepting'}
				<div class="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 mb-5 text-sm text-emerald-800">
					Currently accepting new freelance clients.
				</div>
			{/if}

			{#if work.description}
				<div class="bg-white rounded-lg p-6 shadow-sm text-slate-700 text-sm prose max-w-none prose-li:my-0.5 prose-ul:my-1 prose-p:my-1">
					{@html work.description}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Work Experience -->
	{#if data.workExperiences.length > 0}
		<section class="my-10">
			<div class="flex items-center gap-2 mb-5 pb-2 border-b-2 border-slate-200">
				<span class="w-1 h-6 bg-[var(--color-accent)] rounded-sm"></span>
				<h2 class="font-[var(--font-serif)] text-2xl text-[var(--color-navy)] m-0">Work Experience</h2>
			</div>
			{#each data.workExperiences as exp, i}
				<div class="bg-white rounded-lg p-6 mb-4 shadow-sm border-l-3 border-transparent hover:shadow-md hover:border-l-[var(--color-accent)] transition-all">
					<div class="flex justify-between items-start flex-wrap gap-2 mb-2">
						<div>
							<h3 class="font-[var(--font-serif)] font-bold text-lg text-[var(--color-navy)] m-0">{exp.jobtitle}</h3>
							<div class="text-slate-600 text-sm">{exp.employer}</div>
							{#if exp.location}
								<div class="text-slate-400 text-xs">{exp.location}</div>
							{/if}
						</div>
						<div class="text-slate-400 text-xs whitespace-nowrap">
							{exp.start_date}{#if exp.end_date} &ndash; {exp.end_date}{:else} &ndash; Present{/if}
						</div>
					</div>
					{#if exp.description}
						<div class="mt-3 text-slate-700 text-sm prose max-w-none prose-li:my-0.5 prose-ul:my-1 prose-p:my-1">{@html exp.description}</div>
					{/if}
				</div>
				{#if i === bridgeIndex && freelanceDateRange}
					<div class="flex items-center gap-3 my-4 px-6">
						<div class="flex-1 border-t border-dashed border-slate-300"></div>
						<span class="text-slate-400 text-xs italic whitespace-nowrap">
							Freelance consulting ({freelanceDateRange}) — see above
						</span>
						<div class="flex-1 border-t border-dashed border-slate-300"></div>
					</div>
				{/if}
			{/each}
		</section>
	{/if}

	<!-- Education -->
	{#if data.educations.length > 0}
		<section class="my-10">
			<div class="flex items-center gap-2 mb-5 pb-2 border-b-2 border-slate-200">
				<span class="w-1 h-6 bg-[var(--color-accent)] rounded-sm"></span>
				<h2 class="font-[var(--font-serif)] text-2xl text-[var(--color-navy)] m-0">Education</h2>
			</div>
			{#each data.educations as edu}
				<div class="bg-white rounded-lg p-6 mb-4 shadow-sm border-l-3 border-transparent hover:shadow-md hover:border-l-[var(--color-accent)] transition-all">
					<div class="flex justify-between items-start flex-wrap gap-2 mb-2">
						<div>
							<h3 class="font-[var(--font-serif)] font-bold text-lg text-[var(--color-navy)] m-0">{edu.degree}</h3>
							<div class="text-slate-600 text-sm">{edu.university}</div>
							{#if edu.majors}
								<div class="text-slate-400 text-xs">{edu.majors}</div>
							{/if}
						</div>
						<div class="text-slate-400 text-xs whitespace-nowrap">
							{edu.start_date}{#if edu.end_date} &ndash; {edu.end_date}{/if}
						</div>
					</div>
					{#if edu.details}
						<div class="mt-3 text-slate-700 text-sm prose max-w-none">{@html edu.details}</div>
					{/if}
				</div>
			{/each}
		</section>
	{/if}
</main>

<footer class="text-center py-8 mt-8 border-t border-slate-200 text-slate-400 text-sm bg-[var(--color-cream)]">
	<div>&copy; {new Date().getFullYear()} {fullName}</div>
	{#if data.profile?.source_code_url}
		<div class="mt-1">
			<a href={data.profile.source_code_url} target="_blank" rel="noopener" class="text-slate-400 hover:text-[var(--color-accent)] transition-colors">View source code</a>
		</div>
	{/if}
</footer>
