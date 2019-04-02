let a = `[{
  model:Company,
  where:{
      isValid:1,
      park_id,
      teamType:1,
      lib:1,
  },
  attributes:[]
}],`
const MyError=require('../lib/myError')
const {CommonCodes,getMsg}=require('../lib/errorCode')
const prettyJson = require('../lib/index')
try{
    const out = prettyJson(a)
}catch(err){
    console.log(err)
}

// console.log(out)
const Scan = require('../lib/scan')
const assert = require('assert')
describe('test begin value', () => {
    it('test true', () => {
        assert.equal([1, 2, 3].indexOf(4), -1)
    })
})
