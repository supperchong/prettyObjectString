export = JsToJson;
declare function JsToJson(src: string, options?: JsToJson.Options): string;

declare namespace JsToJson {
    export interface Options {
        delComment?: boolean;
        indent?: string;
        partialIndex?: boolean;
        endOfLine?: string;
        compress?: boolean;
    }
    export interface ParseResult {
        index: number;
        output: string;
    }
    export function parse(src: string, options?: JsToJson.Options): ParseResult;
}