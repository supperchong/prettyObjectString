const JsToJson = require('../lib/index')
const assert = require('chai').assert

describe('pretty js string', () => {
  it('pretty object', () => {
    const str = "{name:'li',age:20}"
    let out = JsToJson(str)
    assert.equal(out, '{\n\t"name": "li",\n\t"age": 20\n}')
  })
  it('pretty single char empty quotation key object', () => {
    const str = '{a:1}'
    let out = JsToJson(str)
    assert.equal(out, '{\n\t"a": 1\n}')
  })
  it('pretty empty  object', () => {
    const str = '{}'
    let out = JsToJson(str)
    assert.equal(out, '{}')
  })
  it('pretty  object last comma', () => {
    const str = '{a:1,}'
    let out = JsToJson(str)
    assert.equal(out, '{\n\t"a": 1\n}')
  })
  it('pretty single quotation object', () => {
    const str = "{'name':'li'}"
    let out = JsToJson(str)
    assert.equal(out, '{\n\t"name": "li"\n}')
  })
  it('pretty array', () => {
    const str = '[{name:\'age\'},null,"people",321,true,false]'
    let out = JsToJson(str)
    assert.equal(
      out,
      '[\n\t{\n\t\t"name": "age"\n\t},\n\tnull,\n\t"people",\n\t321,\n\ttrue,\n\tfalse\n]'
    )
  })
  it('pretty empty  array', () => {
    const str = '[]'
    let out = JsToJson(str)
    assert.equal(out, '[]')
  })
  it('pretty escape characters', () => {
    const str = '[{name:"\\"xiaohuang\\"}]"}]'
    let out = JsToJson(str)
    assert.equal(out, '[\n\t{\n\t\t"name": "\\"xiaohuang\\"}]"\n\t}\n]')
  })
  it('pretty space', () => {
    const str = '  [{name:  "\\"xiaohuang\\"}]"}]'
    let out = JsToJson(str)
    assert.equal(out, '[\n\t{\n\t\t"name": "\\"xiaohuang\\"}]"\n\t}\n]')
  })
  it('delete comment', () => {
    const str = '{"name":"li"//这是注释\n}'
    let out = JsToJson(str, { delComment: true })
    assert.equal(out, '{\n\t"name": "li"\n}')
  })
  it('set custom indent', () => {
    const str = '{"name":"li"\n}'
    const indent = ' '.repeat(4)
    let out = JsToJson(str, { indent })
    assert.equal(out, `{\n${indent}"name": "li"\n}`)
  })
})

describe('test getting index of partial valid js value  from start', () => {
  it('scan array', () => {
    let origin = '["a",true,null,1.1],'
    let partialIndex = origin.length - 1
    let index = JsToJson(origin, { partialIndex: true })
    assert.equal(index, partialIndex)
  })
  it('scan string', () => {
    let originStrs = [
      {
        origin: '"a"',
        expect: '"a"',
      },
      {
        origin: '"a" ,',
        expect: '"a"',
      },
      {
        origin: '"abcd",',
        expect: '"abcd"',
      },
      {
        origin: '"abcd"=true',
        expect: '"abcd"',
      },
      {
        origin: "'abcd'=true",
        expect: "'abcd'",
      },
      {
        origin: "'abcd' ,",
        expect: "'abcd'",
      },
      {
        origin: "'abcd',",
        expect: "'abcd'",
      },
      {
        origin: '""a=',
        expect: '""',
      },
    ]
    originStrs.forEach(({ origin, expect }) => {
      let index = JsToJson(origin, { partialIndex: true })
      assert.equal(index, expect.length)
    })
  })
  it('scan object', () => {
    let originStrs = [
      {
        origin: '{"name":123} ,',
        expect: '{"name":123}',
      },
      {
        origin: '{name:1},',
        expect: '{name:1}',
      },
      {
        origin: '{"name":"li"}=',
        expect: '{"name":"li"}',
      },
    ]
    originStrs.forEach(({ origin, expect }) => {
      let index = JsToJson(origin, { partialIndex: true })
      assert.equal(index, expect.length)
    })
  })
})
