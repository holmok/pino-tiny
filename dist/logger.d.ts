export declare function start(): void;
export declare function prettifier(): any;
export declare function parse(line: string): any;
export declare function format(data: any, key?: string): string | undefined;
export declare function callback(): (input: any, enc: unknown, cb: (error?: any, result?: any) => void) => void;
