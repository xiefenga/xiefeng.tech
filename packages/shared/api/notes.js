import request from './request.js';
const BaseURL = `${process.env.API_URL}/notes`;
export const queryNoteByPath = async (path) => {
    const api = `${BaseURL}?path=${path}`;
    return await request(api);
};
export const queryNoteList = async () => {
    return await request(BaseURL);
};
export const addNote = async (note) => {
    return await request(BaseURL, {
        method: 'POST',
        // headers: {},
        body: JSON.stringify(note),
    });
};
export const updateNote = async (note) => {
    const { id } = await queryNoteByPath(note.path);
    note.id = id;
    return await request(BaseURL, {
        method: 'PUT',
        // headers: {},
        body: JSON.stringify(note),
    });
};
