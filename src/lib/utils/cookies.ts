import cookie, { type CookieSerializeOptions } from 'cookie';

export function setCookie(name: string, value: string, options?: CookieSerializeOptions) {
	document.cookie = cookie.serialize(name, value, options);
}

export function deleteCookie(name: string) {
	setCookie(name, '', {
		expires: new Date(0)
	});
}
