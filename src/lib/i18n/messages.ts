export const SUPPORTED_LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';
export const GROUP_MAX_MEMBERS = 7;

export function pickLocale(acceptLanguage: string | null): Locale {
	if (!acceptLanguage) return DEFAULT_LOCALE;
	const langs = acceptLanguage
		.split(',')
		.map((part) => part.trim().split(';')[0].toLowerCase())
		.filter(Boolean);
	for (const lang of langs) {
		if (lang.startsWith('ko')) return 'ko';
		if (lang.startsWith('en')) return 'en';
	}
	return DEFAULT_LOCALE;
}

type Messages = {
	htmlLang: string;
	ogLocale: string;
	appName: string;
	pageTitle: (groupName: string) => string;
	invitedBy: (nickname: string) => string;
	memberCount: (count: number) => string;
	onboarding: string;
	codeHint: string;
	copy: string;
	copied: string;
	copyFailed: string;
	appStore: string;
	playStore: string;
	alreadyInstalled: string;
	openInApp: string;
	expired: string;
	notFound: string;
	errorTitle: string;
	ogDescription: (nickname: string, count: number) => string;
};

export const messages: Record<Locale, Messages> = {
	ko: {
		htmlLang: 'ko',
		ogLocale: 'ko_KR',
		appName: '루티',
		pageTitle: (groupName) => `${groupName} 그룹 초대 · 루티`,
		invitedBy: (nickname) => `${nickname}님이 초대했어요`,
		memberCount: (count) => `현재 ${count} / ${GROUP_MAX_MEMBERS} 명`,
		onboarding:
			'그룹에는 공통 미션이나 상벌이 없어요.\n서로의 하루를 보고 응원하는 공간이에요.',
		codeHint: '앱 설치 후 코드 입력',
		copy: '복사',
		copied: '코드가 복사됐어요',
		copyFailed: '코드를 길게 눌러 복사하세요',
		appStore: 'App Store',
		playStore: 'Play Store',
		alreadyInstalled: '이미 설치하셨나요?',
		openInApp: '앱에서 열기',
		expired: '이 초대는 만료됐어요. 보낸 사람에게 새 코드를 요청해주세요.',
		notFound: '이 초대는 만료됐어요. 보낸 사람에게 새 코드를 요청해주세요.',
		errorTitle: '초대를 찾을 수 없어요',
		ogDescription: (nickname, count) =>
			`${nickname}님과 ${count}명이 함께 루티를 쓰고 있어요.`
	},
	en: {
		htmlLang: 'en',
		ogLocale: 'en_US',
		appName: 'Rooty',
		pageTitle: (groupName) => `Join ${groupName} on Rooty`,
		invitedBy: (nickname) => `${nickname} invited you`,
		memberCount: (count) => `${count} / ${GROUP_MAX_MEMBERS} members`,
		onboarding:
			'No shared missions, no penalties.\nA place to see each other’s day and cheer each other on.',
		codeHint: 'Install the app and enter the code',
		copy: 'Copy',
		copied: 'Code copied',
		copyFailed: 'Long-press the code to copy',
		appStore: 'App Store',
		playStore: 'Play Store',
		alreadyInstalled: 'Already installed?',
		openInApp: 'Open in app',
		expired: 'This invite has expired. Ask the sender for a new code.',
		notFound: 'This invite has expired. Ask the sender for a new code.',
		errorTitle: 'Invite not found',
		ogDescription: (nickname, count) =>
			`${nickname} and ${count} others are using Rooty together.`
	}
};
