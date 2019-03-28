const { Kind, ParseState, ObjectKeyState } = require('./constants')
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

	scanSingleQuotationKey,
	scanDoubleQuotesKey,
	scanSingleQuotationValue,
	scanEmptyKey,
	scanEmptyKeyEnd,

	scanEnd,
	scanError
} = Kind;
const { parseObjectKey, parseObjectValue, parseArrayValue } = ParseState;
const { SingleQuotationKey, DoubleQuotesKey, EmptyKey } = ObjectKeyState;
class Scan {
	constructor() {
		this.step = this.stateBeginValueOrEmpty;
		this.endTop = false;
		this.parseState = [];
		this.err = null;
		this.stateString = "DefaultString";
		this.stateBoolean = "DefaultBoolean";
		this.stateNull = "DefaultNull";
		this.stateObjectKey = DoubleQuotesKey;
	}
	pushParseState(p) {
		this.parseState.push(p);
	}
	popParseState() {
		this.parseState.pop();
		if (!this.parseState.length) {
			this.step = this.stateEndTop;
			this.endTop = true;
		} else {
			this.step = this.stateEndValue;
		}
	}
	stateEndValue(c) {
		if (!this.parseState.length) {
			this.step = this.stateEndTop;
			this.endTop = true;
			return this.stateEndTop(c);
		}
		if (isSpace(c)) {
			this.step = this.stateEndValue;
			return scanSkipSpace;
		}

		let ps = this.parseState[this.parseState.length - 1];
		switch (ps) {
			case parseObjectKey: {
				if (c === ":") {
					this.parseState[this.parseState.length - 1] = parseObjectValue;
					this.step = this.stateBeginValue;
					return scanObjectKey;
				}
			}
			case parseObjectValue: {
				if (c === ",") {
					this.parseState[this.parseState.length - 1] = parseObjectKey;
					this.step = this.stateBeginObjectKey;
					return scanObjectValue;
				}
				if (c === "}") {
					this.popParseState();
					return scanEndObject;
				}
			}
			case parseArrayValue: {
				if (c === ",") {
					this.step = this.stateBeginValue;
				}
				if (c === "]") {
					this.popParseState();
					return scanEndArray;
				}
			}
		}
	}
	stateEndTop(c) {
		if (!isSpace(c)) {
			// console.log(c);
			throw new Error('c, "after top-level value"');
		}
		return scanEnd;
	}
	stateBeginValueOrEmpty(c) {
		if (isSpace(c)) {
			return scanSkipSpace;
		}
		if (c === "]") {
			return this.stateEndValue(c);
		}
		return this.stateBeginValue(c);
	}
	stateBeginValue(c) {
		if (isSpace(c)) {
			return scanSkipSpace;
		}
		switch (c) {
			case "{": {
				this.step = this.stateBeginObjectKey;
				this.pushParseState(parseObjectKey);
				return scanBeginObject;
			}
			case "[": {
				this.step = this.stateBeginValueOrEmpty;
				this.pushParseState(parseArrayValue);
				return scanBeginArray;
			}
			case '"': {
				this.step = this.stateInString;
				return scanBeginLiteral;
			}
			case "'": {
				this.step = this.stateInString;
				this.stateString = "SingleString";
				return scanSingleQuotationValue;
			}
			case "-": {
				this.step = this.stateNeg;
				return scanBeginLiteral;
			}
			case "0": {
				this.step = this.state0;
				return scanBeginLiteral;
			}
			case "t": {
				this.step = this.stateT;
				return scanBeginLiteral;
			}
			case "f": {
				this.step = this.stateF;
				return scanBeginLiteral;
			}
			case "n": {
				this.step = this.stateN;
				return scanBeginLiteral;
			}
		}
		if (/[1-9]/.test(c)) {
			this.step = this.state1;
			return scanBeginLiteral;
		}
	}
	stateBeginObjectKey(c) {
		if (isSpace(c)) {
			return scanSkipSpace;
		}
		if (c === "}") {
			this.parseState[this.parseState.length - 1] = parseObjectValue;
			return this.stateEndValue(c);
		}
		switch (c) {
			case '"': {
				this.step = this.stateInString;
				this.stateObjectKey = DoubleQuotesKey;
				return scanDoubleQuotesKey;
			}
			case "'": {
				this.step = this.stateInString;
				this.stateObjectKey = SingleQuotationKey;
				return scanSingleQuotationKey;
			}
			default: {
				if (/[a-zA-Z_]/.test(c)) {
					this.step = this.stateInString;
					this.stateObjectKey = EmptyKey;
					return scanEmptyKey;
				} else {
					throw new Error("invalid Object key");
				}
			}
		}
	}
	stateBeginStringOrEmpty(c) {
		if (isSpace(c)) {
			return scanSkipSpace;
		}
		if (c === "}") {
			this.parseState[this.parseState.length - 1] = parseObjectValue;
			return this.stateEndValue(c);
		}
		return this.stateBeginString(c);
	}
	stateBeginString(c) {
		if (isSpace(c)) {
			return scanSkipSpace;
		}
		if (c === '"') {
			this.step = this.stateInString;
			return scanBeginLiteral;
		}
		if (c == "'") {
			this.step = this.stateInString;
			this.stateString = "SingleString";
			return scanSingleQuotationValue;
		}
	}
	stateInString(c, n) {
		switch (this.stateString) {
			case "DefaultString": {
				if (this.stateObjectKey === DoubleQuotesKey) {
					if (c === '"') {
						this.step = this.stateEndValue;
						this.stateObjectKey = DoubleQuotesKey;
						return scanDoubleQuotesKey;
					}
				} else if (this.stateObjectKey === SingleQuotationKey) {
					if (c === "'") {
						this.step = this.stateEndValue;
						this.stateObjectKey = DoubleQuotesKey;
						return scanSingleQuotationKey;
					}
				} else {
					// console.log("asd", scanEmptyKeyEnd);
					if (!/[a-zA-Z0-9_]/.test(n)) {
						this.step = this.stateEndValue;
						this.stateObjectKey = DoubleQuotesKey;
						return scanEmptyKeyEnd;
					}
				}

				if (c === "\\") {
					this.stateString = "StringEsc";
					return scanContinue;
				}
				return scanContinue;
			}
			case "SingleString": {
				if (c === "'") {
					this.step = this.stateEndValue;
					this.stateString = "DefaultString";
					return scanSingleQuotationValue;
				}
				if (c === "\\") {
					this.stateString = "StringEsc";
					return scanContinue;
				}
				return scanContinue;
			}
			case "stringEsc": {
				if (["b", "f", "n", "r", "t", "\\", "/", '"'].includes(c)) {
					this.stateString = "DefaultString";
					return scanContinue;
				}
				if (c === "u") {
					this.stateString = "StringEscU";
					return scanContinue;
				}
			}
			case "StringEscU": {
				if (/[0-9a-fA-F]/.test(c)) {
					this.stateString = "StringEscU1";
					return scanContinue;
				}
			}
			case "StringEscU1": {
				if (/[0-9a-fA-F]/.test(c)) {
					this.stateString = "StringEscU2";
					return scanContinue;
				}
			}
			case "StringEscU2": {
				if (/[0-9a-fA-F]/.test(c)) {
					this.stateString = "StringEscU3";
					return scanContinue;
				}
			}
			case "StringEscU3": {
				if (/[0-9a-fA-F]/.test(c)) {
					this.stateString = "DefaultString";
					return scanContinue;
				}
			}
		}
	}
	stateNeg(c) {
		if (c === "0") {
			this.step = this.state0;
			return scanContinue;
		}
		if (/[1-9]/.test(c)) {
			this.step = this.state1;
			return scanContinue;
		}
	}
	state0(c) {
		if (c === ".") {
			this.step = this.state1;
			return scanContinue;
		}
		if (/[eE]/.test(c)) {
			this.step = this.stateE;
			return scanContinue;
		}
		return this.stateEndValue(c);
	}
	state1(c) {
		if (/\d/.test(c)) {
			this.step = this.state1;
			return scanContinue;
		}
		return this.state0(c);
	}
	stateE(c) {
		if (/\+\-/.test(c)) {
			this.step = this.stateESign;
			return scanContinue;
		}
		return this.stateESign(c);
	}
	stateESign(c) {
		if (/\d/.test(c)) {
			this.step = this.stateE0;
			return scanContinue;
		}
	}
	stateE0(c) {
		if (/\d/.test(c)) {
			return scanContinue;
		}
		return this.stateEndValue(c);
	}
	stateT(c) {
		switch (this.stateBoolean) {
			case "DefaultBoolean": {
				if (c === "r") {
					this.stateBoolean = "Tr";
					return scanContinue;
				}
			}
			case "Tr": {
				if (c === "u") {
					this.stateBoolean = "Tru";
					return scanContinue;
				}
			}
			case "Tru": {
				if (c === "e") {
					this.stateBoolean = "DefaultBoolean";
					this.step = this.stateEndValue;
					return scanContinue;
				}
			}
		}
		throw new Error("in literal true (expecting 'true')");
	}
	stateF(c) {
		switch (this.stateBoolean) {
			case "DefaultBoolean": {
				if (c === "a") {
					this.stateBoolean = "Fa";
					return scanContinue;
				}
			}
			case "Fa": {
				if (c === "l") {
					this.stateBoolean = "Fal";
					return scanContinue;
				}
			}
			case "Fal": {
				if (c === "s") {
					this.stateBoolean = "Fals";
					return scanContinue;
				}
			}
			case "Fals": {
				if (c === "e") {
					this.stateBoolean = "DefaultBoolean";
					this.step = this.stateEndValue;
					return scanContinue;
				}
			}
		}
		throw new Error("in literal true (expecting 'false')");
	}
	stateN(c) {
		switch (this.stateNull) {
			case "DefaultNull": {
				if (c === "u") {
					this.stateNull = "nu";
					return scanContinue;
				}
			}
			case "nu": {
				if (c === "l") {
					this.stateNull = "nul";
					return scanContinue;
				}
			}
			case "nul": {
				if (c === "l") {
					this.stateNull = "DefaultNull";
					this.step = this.stateEndValue;
					return scanContinue;
				}
			}
		}
		throw new Error("in literal true (expecting 'false')");
	}
}
function isSpace(c) {
	return /\s/.test(c);
}
module.exports=Scan