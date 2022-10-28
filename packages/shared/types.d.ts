export declare type Article = {
    id: number;
    title: string;
    words: number;
    createdAt: string;
    updatedAt: string;
    cover: string;
    meta: {
        createdAt: string;
        updatedAt: string;
    };
};
export interface ArticleInfoDto {
    id: number;
    title: string;
    path: string;
    blog: boolean;
    createTime: Date;
    updateTime: Date;
}
export interface ArticleDto {
    id: number;
    title: string;
    content: string;
    path: string;
    blog: boolean;
    createTime: Date;
    updateTime: Date;
}
export declare type Fn = () => void;
export interface RafFnOptions {
    immediate?: boolean;
}
export interface Pausable {
    isActive: {
        current: boolean;
    };
    pause: Fn;
    resume: Fn;
}
