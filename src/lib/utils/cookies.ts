import cookie, { type CookieSerializeOptions } from 'cookie';

export function readCookie(name: string) {
	const cookies = cookie.parse(document.cookie);
	const cookieValue = cookies[name];
	return cookieValue == null ? null : cookieValue;
}

export function setCookie(name: string, value: string, options?: CookieSerializeOptions) {
	document.cookie = cookie.serialize(name, value, options);
}

export function deleteCookie(name: string) {
	setCookie(name, '', {
		expires: new Date(0)
	});
}
