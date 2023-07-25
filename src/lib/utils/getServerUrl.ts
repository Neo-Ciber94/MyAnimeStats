
export function getServerUrl() {
    if (process.env.SERVER_URL) {
        return process.env.SERVER_URL;
    }

    return `http://localhost:${process.env.PORT || 5173}`
}