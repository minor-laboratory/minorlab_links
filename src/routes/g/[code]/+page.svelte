<script lang="ts">
	import { onMount } from 'svelte';
	import { Copy, Check } from '@lucide/svelte';
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
		window.location.href = window.location.href;
	}

	const ok = $derived(data.preview.status === 'ok');
	const ogImageUrl = 'https://rooty.minorlab.com/og-default.png';

	const primaryStoreHref = $derived(isAndroid ? STORE_ANDROID : STORE_IOS);
	const primaryStoreLabel = $derived(isAndroid ? t.playStore : t.appStore);
	const secondaryStoreHref = $derived(isAndroid ? STORE_IOS : STORE_ANDROID);
	const secondaryStoreLabel = $derived(isAndroid ? t.appStore : t.playStore);
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

<main class="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-10 pb-10">
	<header class="mb-10 flex items-center gap-2">
		<img src="/mera.svg" alt="" class="h-7 w-auto" />
		<span class="text-base font-semibold tracking-tight text-rooty-fg">{t.appName}</span>
	</header>

	{#if data.preview.status === 'ok'}
		{@const p = data.preview}
		<section
			class="flex flex-col items-center bg-rooty-surface-container-high rounded-[var(--radius-rooty-card)] px-6 py-10"
		>
			<p class="text-sm text-rooty-muted">{t.invitedBy(p.leader_nickname)}</p>
			<h1 class="mt-4 text-[28px] font-bold tracking-tight text-rooty-fg leading-tight text-center">
				{p.group_name}
			</h1>
			<p class="mt-2 text-sm text-rooty-muted">{t.memberCount(p.member_count)}</p>

			<p
				class="mt-8 max-w-xs text-center text-[15px] leading-relaxed text-rooty-fg whitespace-pre-line"
			>
				{t.onboarding}
			</p>
		</section>

		<section class="mt-6">
			<p class="mb-2 text-xs font-medium text-rooty-muted">{t.codeHint}</p>
			<div class="flex items-stretch gap-2">
				<div
					class="flex-1 flex items-center justify-center bg-rooty-surface-container rounded-[var(--radius-rooty-button)] px-4 py-4 font-mono text-[22px] font-semibold tracking-[0.35em] tabular-nums text-rooty-fg select-all"
				>
					{data.code}
				</div>
				<button
					type="button"
					onclick={copyCode}
					aria-label={t.copy}
					class="flex h-auto w-14 items-center justify-center bg-rooty-surface-container rounded-[var(--radius-rooty-button)] text-rooty-fg transition-colors hover:bg-rooty-outline-variant active:bg-rooty-outline-variant"
				>
					{#if copied}
						<Check class="h-5 w-5" />
					{:else}
						<Copy class="h-5 w-5" />
					{/if}
				</button>
			</div>
		</section>

		<section class="mt-6 flex flex-col gap-3">
			<a
				href={primaryStoreHref}
				class="flex items-center justify-center bg-rooty-primary text-rooty-primary-fg rounded-[var(--radius-rooty-button)] px-4 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80"
			>
				{primaryStoreLabel}
			</a>
			<a
				href={secondaryStoreHref}
				class="flex items-center justify-center border border-rooty-outline rounded-[var(--radius-rooty-button)] px-4 py-3.5 text-sm font-medium text-rooty-fg transition-colors hover:bg-rooty-surface-container active:bg-rooty-surface-container"
			>
				{secondaryStoreLabel}
			</a>
		</section>

		<div class="mt-8 text-center text-sm">
			<span class="text-rooty-muted">{t.alreadyInstalled} </span>
			<button
				type="button"
				onclick={openInApp}
				class="font-semibold text-rooty-fg underline underline-offset-4"
			>
				{t.openInApp}
			</button>
		</div>
	{:else}
		<section
			class="flex flex-col items-center text-center bg-rooty-surface-container-high rounded-[var(--radius-rooty-card)] px-6 py-12"
		>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rooty-surface-container text-2xl"
			>
				⏳
			</div>
			<h1 class="text-lg font-semibold text-rooty-fg">{t.errorTitle}</h1>
			<p class="mt-2 text-sm leading-relaxed text-rooty-muted">
				{data.preview.status === 'expired' ? t.expired : t.notFound}
			</p>
		</section>

		<section class="mt-6 flex flex-col gap-3">
			<a
				href={primaryStoreHref}
				class="flex items-center justify-center bg-rooty-primary text-rooty-primary-fg rounded-[var(--radius-rooty-button)] px-4 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80"
			>
				{primaryStoreLabel}
			</a>
			<a
				href={secondaryStoreHref}
				class="flex items-center justify-center border border-rooty-outline rounded-[var(--radius-rooty-button)] px-4 py-3.5 text-sm font-medium text-rooty-fg transition-colors hover:bg-rooty-surface-container active:bg-rooty-surface-container"
			>
				{secondaryStoreLabel}
			</a>
		</section>
	{/if}

	{#if toast}
		<div
			role="status"
			aria-live="polite"
			class="fixed inset-x-0 bottom-8 mx-auto w-fit max-w-[90%] rounded-full px-4 py-2.5 text-sm font-medium shadow-lg
			{toast.tone === 'ok'
				? 'bg-rooty-fg text-rooty-primary-fg'
				: 'bg-amber-500 text-white'}"
		>
			{toast.message}
		</div>
	{/if}
</main>
