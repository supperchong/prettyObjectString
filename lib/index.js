const { Kind, ParseState, ObjectKeyState } = require('./constants')
const Scan=require('./scan')
const delComment=require('./delComment')
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
    scanDoubleQuotesKey,
    scanSingleQuotationValue,
    scanEmptyKey,
    scanEmptyKeyEnd,

    scanEnd,
    scanError
} = Kind
const { parseObjectKey, parseObjectValue, parseArrayValue } = ParseState
const { SingleQuotationKey, DoubleQuotesKey, EmptyKey } = ObjectKeyState
function getNewline(indent, depth) {
    let insertStr = '\n'
    return insertStr + indent.repeat(depth)
}

function JsToJson(src,options={}) {
    if(options.delComment){
        src=delComment(src)
    }
    
    let indent = '\t'
    let needIndent = false
    let depth = 0
    let i = 0
    let result = ''
    let chars = []
    for (const c of src) {
        chars.push(c)
    }
    let scan = new Scan(chars)
    for (let i = 0; i < chars.length; i++) {
        let c = chars[i]
        let n = chars[i + 1]

        let v = scan.step(c, n, i)
        // console.log('c:',c)
        if (v === scanSkipSpace) {
            continue
        }
        if(v===scanSkipObjectComma){
            continue
        }
        if (needIndent && v != scanEndObject && v != scanEndArray) {
            needIndent = false
            depth++
            result += getNewline(indent, depth)
        }
        if (v === scanContinue) {
            result += c
            continue
        }
        if (v === scanEmptyKey) {
            result += '"'
            result += c

            continue
        }
        if (v === scanEmptyKeyEnd) {
            result += c
            result += '"'

            continue
        }
        if (v === scanSingleQuotationKey) {
            result += '"'
            continue
        }
        if (v === scanSingleQuotationValue) {
            result += '"'
            continue
        }
        switch (c) {
        case '{': {
            needIndent = true
            result += c
            break
        }
        case '[': {
            needIndent = true
            result += c
            break
        }
        case ',': {
            result += c
            result += getNewline(indent, depth)
            break
        }
        case ':': {
            result += c
            result += ' '
            break
        }
        case '}': {
            if (needIndent) {
                needIndent = false
            } else {
                depth--
                result += getNewline(indent, depth)
            }
            result += c
            break
        }
        case ']': {
            if (needIndent) {
                needIndent = false
            } else {
                depth--
                result += getNewline(indent, depth)
            }
            result += c
            break
        }
        default: {
            result += c
        }
        }
    }
    return result
}
module.exports = JsToJson


