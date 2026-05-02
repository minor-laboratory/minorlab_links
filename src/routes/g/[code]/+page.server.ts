import type { PageServerLoad } from './$types';
import { supabase } from '$lib/services/supabase';
import { pickLocale, messages, type Locale } from '$lib/i18n/messages';

type PreviewOk = {
	status: 'ok';
	group_name: string;
	leader_nickname: string;
	member_count: number;
};
type PreviewExpired = { status: 'expired' };
type PreviewNotFound = { status: 'not_found' };
export type Preview = PreviewOk | PreviewExpired | PreviewNotFound;

export const load: PageServerLoad = async ({ params, request, setHeaders }) => {
	const code = (params.code ?? '').toUpperCase();
	const locale: Locale = pickLocale(request.headers.get('accept-language'));
	const t = messages[locale];

	let preview: Preview = { status: 'not_found' };

	const { data, error } = await supabase.rpc('rooty_group_invite_preview_by_code', {
		p_code: code
	});

	if (!error && data && typeof data === 'object' && 'status' in data) {
		preview = data as Preview;
	}

	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=60'
	});

	const ogTitle =
		preview.status === 'ok' ? t.pageTitle(preview.group_name) : `${t.errorTitle} · ${t.appName}`;

	const ogDescription =
		preview.status === 'ok'
			? t.ogDescription(preview.leader_nickname, preview.member_count)
			: preview.status === 'expired'
				? t.expired
				: t.notFound;

	return {
		locale,
		code,
		preview,
		og: {
			title: ogTitle,
			description: ogDescription,
			locale: t.ogLocale
		}
	};
};
