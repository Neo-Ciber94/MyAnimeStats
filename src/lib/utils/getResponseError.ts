
export async function getResponseError(res: Response) {
    if (res.ok) {
        return null;
    }

    const isJson = res.headers.get('Content-Type') === 'application/json';

    if (isJson) {
        const json = await res.json();
        return getErrorMessage(json);
    }

    const text = await res.text();
    return getErrorMessage(text);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(obj: any) {
    if (obj == null) {
        return null;
    }

    if (typeof obj === 'string') {
        return obj;
    }

    if (Array.isArray(obj) && obj.length > 0) {
        return getErrorMessage(obj[0]);
    }

    if (obj.error) {
        return getErrorMessage(obj.error);
    }

    if (obj.errors) {
        return getErrorMessage(obj.errors);
    }

    if (obj.message) {
        return getErrorMessage(obj.message);
    }

    if (obj.description) {
        return getErrorMessage(obj.description);
    }

    if (obj.cause) {
        return getErrorMessage(obj.cause);
    }

    if (obj.detail) {
        return getErrorMessage(obj.detail);
    }

    if (obj.details) {
        return getErrorMessage(obj.details);
    }

    return null;
}