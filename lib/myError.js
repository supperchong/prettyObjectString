function MyError(options) {
    this.code =options.code
    this.msg = options.msg || 'Default Message'
    this.stack = (new Error()).stack
}

MyError.prototype = Object.create(Error.prototype)
MyError.prototype.constructor = MyError
module.exports=MyError