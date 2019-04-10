# prettyJson

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/pretty-object-string.svg?style=flat-square
[npm-url]: https://npmjs.org/package/pretty-object-string
[codecov-image]: https://codecov.io/gh/supperchong/prettyObjectString/branch/master/graphs/badge.svg
[codecov-url]: https://codecov.io/gh/supperchong/prettyObjectString
[download-image]: https://img.shields.io/npm/dm/pretty-object-string.svg?style=flat-square
[download-url]: https://npmjs.org/package/pretty-object-string
prettyJson can format javascript string like this

```js
let a = `{
  code: 200,
  msg: "success",
  datas:[{
    name:'小王',
    age:2
  },{
    'name':"校长",
    age:10
  }]
}`;

const prettyJson = require("../lib/index");

const out = prettyJson(a);
console.log(out);
/**
 * {
 *       "code": 200,
 *       "msg": "success",
 *       "datas": [
 *               {
 *                       "name": "小王",
 *                       "age": 2
 *               },
 *               {
 *                       "name": "校长",
 *                       "age": 10
 *               }
 *       ]
 * }
 */
```
