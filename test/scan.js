const assert = require('chai').assert
let Scan = require('../lib/scan')
const MyError=require('../lib/myError')
const {CommonCodes,getMsg}=require('../lib/errorCode')
const { Kind, ParseState, ObjectKeyState } = require('../lib/constants')
const valueExamples = [
    ['string', '"name\\u1111"'],
    ['number', '112'],
    ['object', '{"name":"li",\'age\':\'21\\\'\\u1234\'}'],
    ['array', '["name",null]'],
    ['true', 'true'],
    ['false', 'false'],
    ['null', 'null'],
    ['array','[-0.34e-34,-12.34e+34,-0e+3,-0e9,-1]']
]
const Errors=[
    ['"name",',CommonCodes.EndError],
    ['{name:age}',CommonCodes.InvalidValue],
    [`{
        name:1,
        age:1,
    }`,CommonCodes.InvalidValue],
    ['"name"{',CommonCodes.EndError],
    ['nl',CommonCodes.InvalidValue],
    ['nua',CommonCodes.InvalidValue],
    ['nula',CommonCodes.InvalidValue],
    ['ff',CommonCodes.InvalidValue],
    ['faf',CommonCodes.InvalidValue],
    ['falf',CommonCodes.InvalidValue],
    ['falsf',CommonCodes.InvalidValue],
    ['ta',CommonCodes.InvalidValue],
    ['tra',CommonCodes.InvalidValue],
    ['trua',CommonCodes.InvalidValue],
    ['"\\uz"',CommonCodes.InvalidValue],
    ['"\\u1z"',CommonCodes.InvalidValue],
    ['"\\u11z"',CommonCodes.InvalidValue],
    ['"\\u111z"',CommonCodes.InvalidValue],
    ['"\\z"',CommonCodes.InvalidValue],
    ['{name:asw',CommonCodes.InvalidValue],
    ['["name"asw',CommonCodes.InvalidValue],
    ['{"name"asw',CommonCodes.InvalidValue],
    ['{"name":"li"asw',CommonCodes.InvalidValue],
    ['{2name:"li"}',CommonCodes.InvalidObjectKey],

]
const {
    scanContinue,
    scanBeginLiteral,
    scanBeginObject,
    scanObjectKey,
    scanObjectValue,
    scanEndObject,
    scanBeginArray,
    scanArrayValue,
    scanEndArray,
    scanSkipSpace,
    scanSkipObjectComma,
    scanSingleQuotationKey,
    scanSingleQuotationKeyEnd,
    scanDoubleQuotesKey,
    scanDoubleQuotesKeyEnd,
    scanSingleQuotationValue,
    scanSingleQuotationValueEnd,
    scanDoubleQuotesValue,
    scanDoubleQuotesValueEnd,
    scanEmptyKey,
    scanEmptyKeyEnd,
    scanSingleCharEmptyKeyEnd,
    scanEnd,
    scanError
} = Kind
function getCharArrs(str){
    let chars = []
    for (const c of str) {
        chars.push(c)
    }
    return chars
}

describe('scan json value', () => {
    // let scan
    // beforeEach(() => {
    //     scan = new Scan()
    //     scan.reset()
    // })
    valueExamples.forEach(([type, example]) => {
        it(`scan ${type}`, () => {
            let chars = getCharArrs(example)
            let scan=new Scan(chars)
            for (let i = 0; i < chars.length; i++) {
                let c = chars[i]
                let n = chars[i + 1]
                scan.step(c, n,i)
            }
        })
    })
})
describe('scan json error',()=>{
    // let scan
    // beforeEach(() => {
    //     scan = new Scan()
    //     scan.reset()
    // })
    Errors.forEach(([example,error])=>{
        it(`expect ${error.msg}`,()=>{
            
            let chars = getCharArrs(example)
            let scan=new Scan(chars)
            for (let i = 0; i < chars.length; i++) {
                let c = chars[i]
                let n = chars[i + 1]
                try{
                    scan.step(c, n,i)
                }catch(err){
                    assert.equal(err.code,error.code)
                    return
                }
            }
        })
    })
})
describe('test scan state',()=>{
    
    it('scan single quotation string begin',()=>{
        let originStr='\''
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(0)
        assert.equal(state,scanSingleQuotationValue)
    })
    it('scan single quotation string end',()=>{
        let originStr='\'name\''
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanSingleQuotationValueEnd)
    })
    it('begin scan object single key begin',()=>{
        let originStr='{\''
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanSingleQuotationKey)
    })
    it('begin scan object single key end',()=>{
        let originStr='{\'asd\''
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanSingleQuotationKeyEnd)
    })
    it('begin scan object end',()=>{
        let originStr=`
        {
            name:1,
            age:1,
        }
        `
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(Kind[state],Kind[scanEnd])
    })
    it('begin scan array',()=>{
        let originStr='['
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanBeginArray)
    })
    it('scan array end',()=>{
        let originStr='[]'
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanEndArray)
    })
    it('scan compose array with string',()=>{
        let originStr='[\'name\',"age"]'
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanEndArray)
    })
    it('scan compose array with string',()=>{
        let originStr='[3,1,\'name\''
        let chars = getCharArrs(originStr)
        let scan=new Scan(chars)
        let state=scan.getStateAt(originStr.length-1)
        assert.equal(state,scanSingleQuotationValueEnd)
    })
})
