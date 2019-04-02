const assert = require('chai').assert
let Scan = require('../lib/scan')
const MyError=require('../lib/myError')
const {CommonCodes,getMsg}=require('../lib/errorCode')
const { Kind, ParseState, ObjectKeyState } = require('../lib/constants')
const valueExamples = [
    ['string', '"name"'],
    ['number', '112'],
    ['object', '{"name":"li"}'],
    ['array', '["name",null]'],
    ['true', 'true'],
    ['false', 'false'],
    ['null', 'null']
]
const Errors=[
    ['"name",',CommonCodes.EndError],
    ['{name:age}',CommonCodes.InvalidValue],
    [`{
        name:1,
        age:1,
    }`,CommonCodes.InvalidValue]
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
            let scan=new Scan(example)
            let chars = []
            for (const c of example) {
                chars.push(c)
            }
            for (let i = 0; i < chars.length; i++) {
                let c = chars[i]
                let n = chars[i + 1]
    
                let v = scan.step(c, n)
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
            
            let chars = []
            for (const c of example) {
                chars.push(c)
            }
            let scan=new Scan(chars)
            for (let i = 0; i < chars.length; i++) {
                let c = chars[i]
                let n = chars[i + 1]
                try{
                    scan.step(c, n,i)
                }catch(err){
                    console.log(err)
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
        console.log(Kind[state])
        assert.equal(state,scanSingleQuotationValueEnd)
    })
})
