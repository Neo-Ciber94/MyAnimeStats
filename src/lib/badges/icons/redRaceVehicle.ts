
export default function redRaceVehicle(size: number) {
    return /*html*/`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><path fill="#3e4347" d="m48.5 34.1l4.7-2.8c1.6-1.2 4.4 0 6.2 2.7c1.7 2.7 1.8 5.8.2 7c-.1.1-.2.2-.4.2l-4.4 2.6l-6.3-9.7"/><path fill="#62696d" d="M49.1 41c1.7 2.7 4.1 4 5.8 2.8c1.6-1.2 1.6-4.3-.2-7c-1.7-2.7-4.5-3.9-6.2-2.7c-1.5 1.1-.7 5 .6 6.9"/><path fill="#3e4347" d="M50.4 40.1c.9 1.4 2.1 2.1 3 1.4c.9-.6.8-2.3-.1-3.7c-.9-1.4-2.4-2.1-3.3-1.4c-.8.6-.5 2.3.4 3.7"/><path fill="#b2c1c0" d="M51.2 38c.9-.5 2.1.8 1.5 1.7l-3.9 2.4l-1.2-2.1l3.6-2"/><path fill="#9c2c1b" d="M47.7 33.4v5.4L43.6 35z"/><path fill="#3e4347" d="m28.5 16.6l5.4-3.2c1.9-1.4 5.1 0 7.1 3.1s2.1 6.7.2 8.1c-.1.1-.3.2-.4.2l-5 3l-7.3-11.2"/><path fill="#62696d" d="M29.1 24.5c2 3.1 4.8 4.6 6.7 3.2c1.9-1.4 1.8-5-.2-8.1c-2-3.1-5.2-4.5-7.1-3.1c-1.8 1.3-.8 5.8.6 8"/><path fill="#9c2c1b" d="m51.1 48.9l-11.4-6.3l-2.9 1.7l-11.6-2.6l-14.3-10.8v-5.1l14.3 10L36.8 40l2.9-2.1l11.4 9.2z"/><path fill="#d33b23" d="m55.3 44.4l-4.2 2.7l-11.4-9.2l-2.9 2.1l-11.6-4.2l-14.3-10l3.6-2.1l2.4.6l8.3-4.6l-.1-1.1l3.3-2l14.9 9.9l4.4 6.9l-3.1 1.5z"/><path fill="#f15744" d="M15.6 15.8v4.4l10.6 5.1l4.7-2.2l-12.4-4.8v-2.5z"/><path fill="#9c2c1b" d="M30.9 26.9v-3.8l-4.7 2.2l-10.6-5.1v-4.4H15v4.8L26.2 29z"/><path fill="#f15744" d="m43.3 26.5l4.4 6.9L36.8 40l-11.6-4.2z"/><g fill="#ffe62e"><path d="m43.3 26.5l4.4 6.9l-1.2.7l-4.5-7z"/><path d="m28.5 16.6l14.8 9.9l-1.3.6l-14.7-9.8zm-1 18L38.4 39l-1.6 1l-11.6-4.2z"/><path d="m12.7 24.7l14.8 9.9l-2.3 1.2l-14.3-10z"/></g><path fill="#9c2c1b" d="M26.2 29c-.3 2.1 2.9 4.8 6 5.2c5.4.8 7.9-2.3 6.3-5.5c-1.5-2.9-7.5-2.3-7.5-2.3L26.2 29"/><path fill="#3e4347" d="m5 29.9l6.2-3.7c2.2-1.6 5.8 0 8 3.5c2.3 3.5 2.4 7.6.2 9.1c-.1.1-.3.2-.5.3l-5.7 3.4L5 29.9"/><path fill="#62696d" d="M5.7 38.9c2.3 3.5 5.4 5.2 7.6 3.6c2.2-1.6 2-5.6-.2-9.1c-2.3-3.5-5.9-5.1-8-3.5c-2.1 1.5-1 6.5.6 9"/><path fill="#3e4347" d="M7.5 37.7c1.2 1.9 2.7 2.7 3.9 1.9c1.1-.8 1.1-3-.1-4.9c-1.3-1.8-3.2-2.7-4.4-1.8c-1.1.8-.6 2.9.6 4.8"/><path fill="#b2c1c0" d="M43.5 42.5c.9-.5 2.1.8 1.5 1.7l-3.9 2.4l-1.2-2.1l3.6-2"/><path fill="#3e4347" d="m31.5 43.3l5.4-3.2c1.9-1.4 5.1 0 7.1 3.1s2.1 6.7.2 8.1c-.1.1-.3.2-.4.2l-5 3l-7.3-11.2"/><path fill="#62696d" d="M32.1 51.3c2 3.1 4.8 4.6 6.7 3.2c1.9-1.4 1.8-5-.2-8.1c-2-3.1-5.2-4.5-7.1-3.1c-1.8 1.3-.8 5.8.6 8"/><path fill="#3e4347" d="M33.7 50.2c1.1 1.6 2.4 2.4 3.4 1.7s1-2.7-.1-4.3c-1.1-1.6-2.8-2.4-3.8-1.6c-1 .7-.6 2.6.5 4.2"/><path fill="#d33b23" d="m22.7 9l4 3.6l-18.6 9.8L2 16.8z"/><path fill="#42ade2" d="M27.6 28.7c0 3 3.6 4.5 6.4 4.5c2.9 0 3.9-1.5 3.9-4.5s-2.3-5.4-5.2-5.4c-2.8 0-5.1 2.4-5.1 5.4"/><path fill="#3e4347" d="M30.7 28.6c.1-1.1 3.9-1.1 6.8-1.3c.9-.1.8 3.3 0 3.4c-4.6.4-6.9-1-6.8-2.1"/><path fill="#f15744" d="m60 40.9l2 4.4l-13.1 8.8l-5.9-2.7l11.8-7.3z"/><path fill="#ffe62e" d="m4.8 15.7l6.4 5.1l1.8-.9l-5.8-5.1zm14.4-5.4l4.3 4l1.3-.7l-4-3.9zm38 32.4l2.2 4.3l1.1-.7l-2-4.4zm-11.6 7.1l4.9 3.2l1.1-.8L47 49z"/></svg>
    `;
}