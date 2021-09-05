#!/usr/bin/env node
import { prettifier } from './logger';
export interface PinoTinyOptions {
    hideIcons?: boolean;
    hideLetters?: boolean;
    hideTimestamp?: boolean;
    hideColors?: boolean;
    hideWeb?: boolean;
    msgKey?: string;
    filter?: (data: any) => any | undefined;
}
declare function run(filter?: (data: any) => any | undefined): void;
export declare const PinoTinyPrettifier: typeof prettifier;
export declare const Run: typeof run;
export {};
