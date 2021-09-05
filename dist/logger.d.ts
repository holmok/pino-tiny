import { PinoTinyOptions } from '.';
export declare function start(options: PinoTinyOptions): void;
export declare function prettifier(options: PinoTinyOptions): any;
export declare function parse(line: string): any;
export declare function format(data: any, options?: PinoTinyOptions): string | undefined;
export declare function callback(options: PinoTinyOptions): (input: any, enc: unknown, cb: (error?: any, result?: any) => void) => void;
