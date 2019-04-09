const JsToJson=require('../lib/index')
const assert = require('chai').assert


describe('pretty js string',()=>{
    it('pretty object',()=>{
        const str='{name:\'li\',age:20}'       
        let out=JsToJson(str)
        assert.equal(out,'{\n\t"name": "li",\n\t"age": 20\n}')
    })
    it('pretty single char empty quotation key object',()=>{
        const str='{a:1}'       
        let out=JsToJson(str)
        assert.equal(out,'{\n\t"a": 1\n}')
    })
    it('pretty empty  object',()=>{
        const str='{}'       
        let out=JsToJson(str)
        assert.equal(out,'{}')
    })
    it('pretty  object last comma',()=>{
        const str='{a:1,}'       
        let out=JsToJson(str)
        assert.equal(out,'{\n\t"a": 1\n}')
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
    it('pretty empty  array',()=>{
        const str='[]'       
        let out=JsToJson(str)
        assert.equal(out,'[]')
    })
    it('pretty escape characters',()=>{
        const str='[{name:"\\"xiaohuang\\"}]"}]'       
        let out=JsToJson(str)
        assert.equal(out,'[\n\t{\n\t\t"name": "\\"xiaohuang\\"}]"\n\t}\n]')
    })
    it('pretty space',()=>{
        const str='  [{name:  "\\"xiaohuang\\"}]"}]'       
        let out=JsToJson(str)
        assert.equal(out,'[\n\t{\n\t\t"name": "\\"xiaohuang\\"}]"\n\t}\n]')
    })
    it('delete comment',()=>{
        const str='{"name":"li"//这是注释\n}'       
        let out=JsToJson(str,{delComment:true})
        assert.equal(out,'{\n\t"name": "li"\n}')
    })
})
