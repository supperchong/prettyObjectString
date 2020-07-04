const CommonCodes={
    InvalidObjectKey:{
        code:1,
        msg:'invalid object key'
    },
    InvalidValue:{
        code:2,
        msg:'invalid value'
    },
    EndError:{
        code:3,
        msg:'error after top value'
    }
}
let CodeMsg={}
Object.values(CommonCodes).forEach(({code,msg})=>{
    CodeMsg[code]=msg
})

function getMsg(i,origin,code){
    let msg=origin.slice(Math.max(i-20,0),i+1).trim()
    return `${CodeMsg[code]} at "${msg}"`
}

exports.CommonCodes=CommonCodes
exports.getMsg=getMsg

