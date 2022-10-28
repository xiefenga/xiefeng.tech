import { ArticleDto, ArticleInfoDto } from '../types.js';
export declare const queryNoteByPath: (path: string) => Promise<ArticleDto>;
export declare const queryNoteList: () => Promise<ArticleInfoDto[]>;
export declare const addNote: (note: ArticleDto) => Promise<ArticleDto>;
export declare const updateNote: (note: ArticleDto) => Promise<ArticleDto>;
