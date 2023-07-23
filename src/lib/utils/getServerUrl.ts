
export function getServerUrl() {
    if (process.env.SERVER_URL) {
        return process.env.SERVER_URL;
    }

    return `http://127.0.0.1:${process.env.PORT || 5173}`
}