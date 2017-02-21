export declare class PathUtils {
    static basename(path: string, ext?: string): string;
    static changeExtname(pathStr: string, extname: string): string;
    static changeBasename(pathStr: string, basename: string, isSameExt?: boolean): string;
    static extname(path: string): string;
    static dirname(path: string): string;
    private static _splitPath(fileName);
}
