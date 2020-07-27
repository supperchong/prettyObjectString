const { Kind, ParseState, ObjectKeyState } = require('./constants')
const Scan = require('./scan')
const delComment = require('./delComment')
const DefaultIndent = '\t'
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
  scanError,
} = Kind
const { parseObjectKey, parseObjectValue, parseArrayValue } = ParseState
const { SingleQuotationKey, DoubleQuotesKey, EmptyKey } = ObjectKeyState
function getNewline(indent, depth, endOfLine) {
  return endOfLine + indent.repeat(depth)
}

/**
 *
 * @param {string} src origin code
 * @param {object} options
 * @param {string} options.indent
 * @param {boolean} options.partialIndex
 * @param {string} options.endOfLine set the end of line,eg: \n ,\r\n
 * @param {boolean} options.compress compress the code by removing extra space, indent or endOfLine
 */
function parse(src, options = {}) {
  if (options.delComment) {
    src = delComment(src)
  }

  let { indent = DefaultIndent, partialIndex = false, endOfLine = '\n', compress = false } = options
  let needIndent = false
  let depth = 0
  let result = ''
  let keyValueSpan = ' '
  const chars = src
  let scan = new Scan(chars, partialIndex)
  if (compress) {
    keyValueSpan = ''
    indent = ''
    endOfLine = ''
  }
  for (let i = 0; i < chars.length; i++) {
    let c = chars[i]
    let n = chars[i + 1]

    let v = scan.step(c, n, i)
    if (v === scanEnd && options.partialIndex) {
      return {
        index: i,
        output: result,
      }
    }
    if (v === scanSkipSpace) {
      continue
    }
    if (v === scanSkipObjectComma) {
      continue
    }
    if (needIndent && v != scanEndObject && v != scanEndArray) {
      needIndent = false
      depth++
      result += getNewline(indent, depth, endOfLine)
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
    /**
     * object key is a char
     * example {a:1}=>{"a":1}
     */
    if (v === scanSingleCharEmptyKeyEnd) {
      result += '"'
      result += c
      result += '"'
      continue
    }
    if (
      [
        scanSingleQuotationKey,
        scanSingleQuotationKeyEnd,
        scanSingleQuotationValue,
        scanSingleQuotationValueEnd,
      ].includes(v)
    ) {
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
        result += getNewline(indent, depth, endOfLine)
        break
      }
      case ':': {
        result += c
        result += keyValueSpan
        break
      }
      case '}': {
        if (needIndent) {
          needIndent = false
        } else {
          depth--
          result += getNewline(indent, depth, endOfLine)
        }
        result += c
        break
      }
      case ']': {
        if (needIndent) {
          needIndent = false
        } else {
          depth--
          result += getNewline(indent, depth, endOfLine)
        }
        result += c
        break
      }
      default: {
        result += c
      }
    }
  }
  return {
    index: chars.length,
    output: result,
  }
}

/**
 *
 * @param {string} src origin code
 * @param {object} options
 * @param {string} options.indent
 * @param {boolean} options.partialIndex
 * @param {string} options.endOfLine set the end of line,eg: \n ,\r\n
 * @param {boolean} options.compress compress the code by removing extra space, indent or endOfLine
 */
function JsToJson(src, options = {}) {
  const result = parse(src, options)
  return result.output
}
module.exports = JsToJson
exports = module.exports
exports.parse = parse
