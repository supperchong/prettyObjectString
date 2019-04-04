const JsToJson=require('../lib/index')
const assert = require('chai').assert


describe('pretty js string',()=>{
    it('pretty object',()=>{
        const str='{name:\'age\'}'       
        let out=JsToJson(str)
        assert.equal(out,'{\n\t"name": "age"\n}')
    })
    it('pretty single quotation object',()=>{
        const str='{\'name\':\'li\'}'       
        let out=JsToJson(str)
        assert.equal(out,'{\n\t"name": "li"\n}')
    })
    it('pretty array',()=>{
        const str='[{name:\'age\'},null,"people",321,true,false]'       
        let out=JsToJson(str)
        assert.equal(out,'[\n\t{\n\t\t"name": "age"\n\t},\n\tnull,\n\t"people",\n\t321,\n\ttrue,\n\tfalse\n]')
    })
})
