import { ArticleDto, ArticleInfoDto } from '../types.js';
export declare const queryBlogList: () => Promise<ArticleInfoDto[]>;
export declare const queryBlogByTitle: (title: string) => Promise<ArticleDto | null>;
export declare const queryBlogPaths: () => Promise<string[]>;
