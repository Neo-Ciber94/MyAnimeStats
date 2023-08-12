
export default function onePieceWhitebeardFlag(size: number) {
    return /*html*/`<img width="${size + 10}" height="${size + 10}" src="data:image/png;base64,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"/>`
}