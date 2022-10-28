import { fetch } from 'undici';
export default async function request(input, init) {
    const resp = await fetch(input, init);
    const json = await resp.json();
    return json.data;
}
