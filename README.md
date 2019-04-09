# prettyJson

[![Test coverage][codecov-image]][codecov-url]

[codecov-image]: https://codecov.io/gh/supperchong/prettyObjectString/branch/master/graphs/badge.svg
[codecov-url]: https://codecov.io/gh/supperchong/prettyObjectString

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
