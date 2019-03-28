let a=`{
  code: 200,
  msg: "success",
  datas:[{
    name:'小王',
    age:2
  },{
    'name':"校长",
    age:10
  }]
}`

const prettyJson=require('../lib/index')

const out=prettyJson(a)
console.log(out)
