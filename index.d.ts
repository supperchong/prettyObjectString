export = JsToJson;
declare function JsToJson(src: string,options?:JsToJson.Options): string;
declare namespace JsToJson {
    export interface Options {
        delComment?: boolean;
        indent?: string;
    }
}