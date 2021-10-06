declare function error(...text: unknown[]): void;
declare function info(...text: unknown[]): void;
declare function success(...text: unknown[]): void;
declare const _default: {
    error: typeof error;
    info: typeof info;
    success: typeof success;
};
export default _default;
