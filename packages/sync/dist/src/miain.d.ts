declare type Handler = (path: string) => void;
export declare const monitor: (path: string, onAdd: Handler, onChange: Handler) => void;
export {};
