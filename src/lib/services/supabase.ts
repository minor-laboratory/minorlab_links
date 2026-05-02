import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// 환경별 분기 (#1387) — runtime read. Cloudflare Pages secrets 에서 읽어
// 한 build artifact 를 prod / dev 두 project 에 공통 deploy 가능.

const url = env.PUBLIC_SUPABASE_URL;
const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
	throw new Error('PUBLIC_SUPABASE_URL is not set');
}

if (!anonKey) {
	throw new Error('PUBLIC_SUPABASE_ANON_KEY is not set');
}

export const supabase = createClient(url, anonKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false
	}
});
