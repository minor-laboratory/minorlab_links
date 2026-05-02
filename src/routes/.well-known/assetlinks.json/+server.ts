import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

// rooty Android App Link 검증용 assetlinks.json — 환경별 분기 (#1387).
//
// 환경변수 `PUBLIC_ENV` 를 보고 도메인별로 다른 패키지 등록.
// - rooty.minorlab.com (prod project, PUBLIC_ENV=prod):
//     com.minorlab.rooty 만 (prod keystore SHA)
// - dev.rooty.minorlab.com (dev project, PUBLIC_ENV=dev):
//     com.minorlab.rooty.dev 만 (prod keystore + debug keystore SHA)
//
// minorlab 공통 keystore 정보는 rooty 메모리 `android_signing.md` 참조.

const PROD_KEYSTORE_SHA =
	'61:AE:42:B7:A4:9B:FF:6A:84:6F:CD:FC:79:0D:3A:7E:25:7A:46:18:35:72:96:BD:43:93:9B:84:F1:BA:38:98';
const DEBUG_KEYSTORE_SHA =
	'8B:55:27:A2:AC:5C:34:F8:F4:34:34:25:DC:7B:17:DC:C1:09:51:92:C0:6A:3F:AB:9C:BF:84:E2:15:C9:4E:A1';

const PROD_ENTRY = {
	relation: ['delegate_permission/common.handle_all_urls'],
	target: {
		namespace: 'android_app',
		package_name: 'com.minorlab.rooty',
		sha256_cert_fingerprints: [PROD_KEYSTORE_SHA]
	}
};

const DEV_ENTRY = {
	relation: ['delegate_permission/common.handle_all_urls'],
	target: {
		namespace: 'android_app',
		package_name: 'com.minorlab.rooty.dev',
		sha256_cert_fingerprints: [PROD_KEYSTORE_SHA, DEBUG_KEYSTORE_SHA]
	}
};

export const GET: RequestHandler = () => {
	const body = env.PUBLIC_ENV === 'dev' ? [DEV_ENTRY] : [PROD_ENTRY];
	return new Response(JSON.stringify(body, null, 2), {
		headers: {
			'content-type': 'application/json',
			'cache-control': 'public, max-age=300, s-maxage=300'
		}
	});
};
