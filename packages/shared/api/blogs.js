import request from './request.js';
const BaseURL = `${process.env.API_URL}/blogs`;
export const queryBlogList = async () => {
    return await request(BaseURL);
};
export const queryBlogByTitle = async (title) => {
    const api = `${BaseURL}?title=${title}`;
    return request(api);
};
export const queryBlogPaths = async () => {
    const api = `${BaseURL}/paths`;
    return await request(api);
};
