import { RequestInfo, RequestInit } from 'undici';
export default function request<T = object>(input: RequestInfo, init?: RequestInit): Promise<T>;
