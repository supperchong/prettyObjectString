const assert = require('chai').assert
let Scan = require('../lib/scan')
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
    ['"name",']
]
describe('scan json value', () => {
    let scan
    beforeEach(() => {
        scan = new Scan()
        scan.reset()
        console.log('reset')
    })
    valueExamples.forEach(([type, example]) => {
        it(`scan ${type}`, () => {
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
