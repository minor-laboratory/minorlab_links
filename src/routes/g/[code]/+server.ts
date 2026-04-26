import { redirect, type RequestHandler } from '@sveltejs/kit';

const STORE_IOS = 'https://apps.apple.com/app/id6757320685';
const STORE_ANDROID = 'https://play.google.com/store/apps/details?id=com.minorlab.rooty';

/**
 * /g/{code} fallback handler.
 *
 * iOS Universal Link / Android App Link 가 매칭되면 OS 가 브라우저 진입 자체를
 * 가로채 앱으로 직행하므로 이 핸들러는 **앱 미설치** 사용자만 도달한다.
 * User-Agent 로 OS 분기 후 즉시 스토어 302.
 *
 * 페이지 디자인 X (rooty #1201 + DESIGN_DEEPLINK §10).
 */
export const GET: RequestHandler = ({ request }) => {
	const ua = request.headers.get('user-agent') ?? '';
	const target = /android/i.test(ua) ? STORE_ANDROID : STORE_IOS;
	throw redirect(302, target);
};
