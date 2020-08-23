type DecimalInputs = number | bigint | Decimal | string;

/**
 * An implementation of Decimal.js that uses BigInts.
 * @author Khafra (KhafraDev)
 */
export class Decimal {
    value: bigint;
    constructor(value: DecimalInputs) {
        this.value = this.factory(value);
	}

	/**
	 * Create a Decimal object.
	 */
	factory(value: DecimalInputs) {
		if(typeof value === 'bigint') {
			return value;
		} else if(typeof value === 'number') {
			if(value !== value) { // easy NaN check
				throw new Error('Factory method encountered NaN!');
			} else if(!Number.isFinite(value)) { // Infinity check
				throw new Error('Factory method encountered Infinity!');
			}

			return BigInt(Math.floor(value));
		} else if(typeof value === 'string') {
			if(+value === +value && isFinite(+value) && Number.isSafeInteger(+value)) { // string can be converted to number
				return BigInt(Math.floor(+value));
			} else if(value.indexOf('e') === -1) { // can be converted to BigInt easily
				return BigInt(value.split('.').shift());
			}

			// 1.4e1000 -> true
			// 1e1000 	-> true
			if(!/\d+e\+?\d+/.test(value)) {
				throw new Error(`Invalid string received: ${value}.`);
			} else if(value.indexOf('.') > -1 && value.indexOf('e') === -1) { 
				// 1.44020293 -> true
				// 1.4e100000 -> false
				return BigInt(value.split('.').shift());
			}
			
			const [mantissa, exponent] = value.split(/e\+?/);
			const places = (+mantissa % 1 === 0) // 1.4 % 1 !== 0, 1 % 1 === 0
				? +exponent
				: Math.abs((mantissa.length - 1) - +exponent);
			const intStr = mantissa.replace(/[^0-9\-]/, '').padEnd(places, '0');

			return BigInt(intStr);
		} else if(value instanceof Decimal) { 
			return BigInt(value.value);
		} else {
			const toString = {}.toString;
			throw new Error(`Unexpected type in factory method: ${toString.call(value)}`)
		}
	}
	
	/**
	 * Check if the current Decimal value is greater than or equal to another Decimal
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	greaterThanOrEqualTo(value: DecimalInputs) {
		return this.value >= this.factory(value);
	}

	/**
	 * Check if the current Decimal value is less than or equal to another Decimal
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	lessThanOrEqualTo(value: DecimalInputs) {
		return this.value <= this.factory(value);
	}

	/**
	 * Check if the current Decimal value is greater than another Decimal
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	greaterThan(value: DecimalInputs) {
		return this.value > this.factory(value);
	}

	/**
	 * Check if the current Decimal value is less than another Decimal
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	lessThan(value: DecimalInputs) {
		return this.value < this.factory(value);
	}

	/**
	 * @return 
	 * 	1 		if the value of the current Decimal is greater than the value of the input
	 * 
	 * 	-1 		if the value of the current Decimal is less than the value of the input
	 * 
	 * 	0		if they are equal
	 * @param value Value to compare to
	 */
	compareTo(value: DecimalInputs) {
		value = this.factory(value);
		if(Number.isNaN(value) || Number.isNaN(this.value)) {
			return NaN;
		} else if(this.value === value) {
			return 0;
		} else if(this.value > value) {
			return 1;
		} else { // this.value < value
			return -1;
		}
	}

	/**
	 * Divide the current Decimal by a Decimal-like value.
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	dividedBy(value: DecimalInputs) {
		return this.value / this.factory(value);
	}

	/**
	 * Returns `true` if values are equal, false otherwise.
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	equals(value: DecimalInputs) {
		return this.value === this.factory(value);
	}

	/**
	 * @see {bigint.toString}
	 * @param radix number
	 */
    toString(radix?: number) {
        return this.value.toString(radix);
	}
	
	/**
	 * Subtract 2 Decimals.
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	minus(value: DecimalInputs) {
		return this.value = this.value - this.factory(value), this;
	}

	/**
	 * Add 2 Decimals.
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	add(value: DecimalInputs) {
		return this.value = this.value + this.factory(value), this;
	}

	/**
	 * Multiply 2 Decimals.
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	multiply(value: DecimalInputs) {
		return this.value = this.value * this.factory(value), this;
	}

	/**
	 * Get remainder of a Decimal given a Decimal-like value
	 * @param {DecimalInputs} value string | bigint | number | Decimal
	 */
	modulo(value: DecimalInputs) {
		return this.value % this.factory(value);
	}

	/**
	 * Return a negated Decimal.
	 */
	negate() {
		return this.value * -1n;
	}

	/**
	 * nth root
	 * @see https://stackoverflow.com/a/58863398
	 */
	root(k = 2n) {
		k = this.factory(k);
		let o = 0n;
		let x = this.value;
		let limit = 100n;
		
		while(x ** k !== k && x !== o && --limit) {
		  o = x;
		  x = ((k - 1n) * x + this.value / x ** (k - 1n)) / k;
		}
		
		return x;
	}

	/**
	 * multiply a Decimal by itself <value> times.
	 * @throws if value < 0n
	 */
	pow(value: DecimalInputs) {
		value = this.factory(value);
		if(value < 0n) {
			throw new Error(`Received negative power ${value} on <Decimal>.pow!`);
		}

        return this.value ** value;
    }

	/**
	 * multiply a given Decimal-like value by itself <value> times.
	 * is called on the Decimal class itself; not in an instance of Decimal.
	 * @throws if value < 0n
	 */
    static pow(a: DecimalInputs, b: DecimalInputs) {
        a = new Decimal(a);
        b = new Decimal(b);

		if(b.value < 0n) {
			throw new Error(`Received negative power ${b} on static Decimal.pow!`);
		}
		
		return a.value ** b.value;
    }

	/**
	 * Returns an Object representation of a Decimal class.
	 * Can be used in JSON.stringify to convert to and from BigInt.
	 */
    toObject() {
        return {
            value: this.value.toString()
        }
    }
}