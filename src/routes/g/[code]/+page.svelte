<script lang="ts">
	import { onMount } from 'svelte';
	import { Copy, Check, AppleIcon, PlayIcon } from '@lucide/svelte';
	import { messages } from '$lib/i18n/messages';

	let { data } = $props();
	const t = $derived(messages[data.locale]);

	const STORE_IOS = 'https://apps.apple.com/app/id6757320685';
	const STORE_ANDROID =
		'https://play.google.com/store/apps/details?id=com.minorlab.rooty';

	let isAndroid = $state(false);
	let isIOS = $state(false);
	let toast = $state<{ message: string; tone: 'ok' | 'warn' } | null>(null);
	let copied = $state(false);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		const ua = navigator.userAgent;
		isAndroid = /android/i.test(ua);
		isIOS = /iphone|ipad|ipod/i.test(ua) && !(window as { MSStream?: unknown }).MSStream;
	});

	function showToast(message: string, tone: 'ok' | 'warn' = 'ok') {
		if (toastTimer) clearTimeout(toastTimer);
		toast = { message, tone };
		toastTimer = setTimeout(() => {
			toast = null;
		}, 2400);
	}

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(data.code);
			copied = true;
			showToast(t.copied, 'ok');
			setTimeout(() => (copied = false), 1800);
		} catch {
			showToast(t.copyFailed, 'warn');
		}
	}

	function openInApp() {
		// Universal Link / App Link 재시도. OS 가 가로채지 못하면 같은 페이지 새로고침.
		window.location.href = window.location.href;
	}

	const ok = $derived(data.preview.status === 'ok');
	const ogImageUrl = 'https://rooty.minorlab.com/og-default.png';
</script>

<svelte:head>
	<title>{data.og.title}</title>
	<meta name="description" content={data.og.description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={data.og.title} />
	<meta property="og:description" content={data.og.description} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:locale" content={data.og.locale} />
	<meta property="og:site_name" content={t.appName} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.og.title} />
	<meta name="twitter:description" content={data.og.description} />
	<meta name="twitter:image" content={ogImageUrl} />
	{#if !ok}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<main class="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-10 pb-12">
	<header class="mb-8 flex items-center gap-2 text-rooty-fg">
		<span class="text-xl">🌱</span>
		<span class="text-base font-semibold tracking-tight">{t.appName}</span>
	</header>

	{#if data.preview.status === 'ok'}
		{@const p = data.preview}
		<section
			class="bg-rooty-card border-rooty-border flex flex-col items-center rounded-[var(--radius-rooty)] border px-6 py-8 shadow-sm"
		>
			<p class="text-rooty-muted text-sm">{t.invitedBy(p.leader_nickname)}</p>
			<h1 class="mt-3 text-3xl font-bold tracking-tight">{p.group_name}</h1>
			<p class="text-rooty-muted mt-1 text-sm">{t.memberCount(p.member_count)}</p>

			<p
				class="text-rooty-muted mx-auto mt-6 max-w-xs text-center text-sm leading-relaxed whitespace-pre-line"
			>
				{t.onboarding}
			</p>

			<div class="mt-8 flex w-full items-center justify-center gap-2">
				<div
					class="border-rooty-border bg-rooty-accent flex-1 rounded-[var(--radius-rooty)] border px-4 py-3 text-center font-mono text-2xl font-semibold tracking-[0.4em] tabular-nums select-all"
				>
					{data.code}
				</div>
				<button
					type="button"
					onclick={copyCode}
					aria-label={t.copy}
					class="border-rooty-border bg-rooty-card hover:bg-rooty-accent active:bg-rooty-accent flex h-[52px] w-[52px] items-center justify-center rounded-[var(--radius-rooty)] border transition-colors"
				>
					{#if copied}
						<Check class="text-rooty-primary h-5 w-5" />
					{:else}
						<Copy class="h-5 w-5" />
					{/if}
				</button>
			</div>
			<p class="text-rooty-muted mt-3 text-xs">{t.codeHint}</p>
		</section>

		<div class="mt-6 grid grid-cols-2 gap-3">
			<a
				href={STORE_IOS}
				class="border-rooty-border bg-rooty-card hover:bg-rooty-accent flex items-center justify-center gap-2 rounded-[var(--radius-rooty)] border px-4 py-3 text-sm font-medium transition-colors {isIOS
					? 'ring-rooty-primary ring-2'
					: ''}"
			>
				<AppleIcon class="h-4 w-4" />
				{t.appStore}
			</a>
			<a
				href={STORE_ANDROID}
				class="border-rooty-border bg-rooty-card hover:bg-rooty-accent flex items-center justify-center gap-2 rounded-[var(--radius-rooty)] border px-4 py-3 text-sm font-medium transition-colors {isAndroid
					? 'ring-rooty-primary ring-2'
					: ''}"
			>
				<PlayIcon class="h-4 w-4" />
				{t.playStore}
			</a>
		</div>

		<div class="mt-8 text-center text-sm">
			<p class="text-rooty-muted">{t.alreadyInstalled}</p>
			<button
				type="button"
				onclick={openInApp}
				class="text-rooty-primary mt-1 font-semibold underline-offset-4 hover:underline"
			>
				{t.openInApp}
			</button>
		</div>
	{:else}
		<section
			class="bg-rooty-card border-rooty-border flex flex-col items-center rounded-[var(--radius-rooty)] border px-6 py-10 text-center shadow-sm"
		>
			<div
				class="bg-rooty-accent text-rooty-fg mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
			>
				⏳
			</div>
			<h1 class="text-xl font-semibold">{t.errorTitle}</h1>
			<p class="text-rooty-muted mt-2 text-sm leading-relaxed">
				{data.preview.status === 'expired' ? t.expired : t.notFound}
			</p>
		</section>

		<div class="mt-6 grid grid-cols-2 gap-3">
			<a
				href={STORE_IOS}
				class="border-rooty-border bg-rooty-card hover:bg-rooty-accent flex items-center justify-center gap-2 rounded-[var(--radius-rooty)] border px-4 py-3 text-sm font-medium transition-colors"
			>
				<AppleIcon class="h-4 w-4" />
				{t.appStore}
			</a>
			<a
				href={STORE_ANDROID}
				class="border-rooty-border bg-rooty-card hover:bg-rooty-accent flex items-center justify-center gap-2 rounded-[var(--radius-rooty)] border px-4 py-3 text-sm font-medium transition-colors"
			>
				<PlayIcon class="h-4 w-4" />
				{t.playStore}
			</a>
		</div>
	{/if}

	{#if toast}
		<div
			role="status"
			aria-live="polite"
			class="fixed inset-x-0 bottom-8 mx-auto w-fit max-w-[90%] rounded-full px-4 py-2 text-sm font-medium shadow-lg
			{toast.tone === 'ok'
				? 'bg-rooty-fg text-rooty-card'
				: 'bg-amber-500 text-white'}"
		>
			{toast.message}
		</div>
	{/if}
</main>
