import type { Handle } from '@sveltejs/kit';
import { pickLocale } from '$lib/i18n/messages';

export const handle: Handle = ({ event, resolve }) => {
	const locale = pickLocale(event.request.headers.get('accept-language'));
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
};
