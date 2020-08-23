const assert = require('assert');
const { Decimal } = require('../Decimal');

describe('Decimals can be created from strings, numbers, BigInts, or already existing Decimals.', () => {
    it('works with scientific notation strings and numbers', () => {
        assert.strictEqual(new Decimal('10e10').value, BigInt(10e10));
        assert.strictEqual(new Decimal('1.5e6').value, BigInt('1500000'));
        assert.strictEqual(new Decimal(1e6).value, 1000000n);
    });

    it('works with regular number-like strings and numbers', () => {
        assert.strictEqual(new Decimal('1000000').value, BigInt(1e6));
        assert.strictEqual(new Decimal('1'.padEnd(1000, '0')).value, BigInt('1'.padEnd(1000, '0')));
        assert.strictEqual(new Decimal(Number.MAX_SAFE_INTEGER).value, 9007199254740991n);
    });

    it('converts floats to integers in strings and numbers', () => {
        assert.strictEqual(new Decimal('43241386.5347951').value, 43241386n);
        assert.strictEqual(new Decimal(100000.005053920).value, 100000n);
    });

    it('throws when Infinity or NaN is passed through', () => {
        assert.throws(() => new Decimal(Infinity));
        assert.throws(() => new Decimal(1e1000));
        assert.throws(() => new Decimal(NaN));
    });

    it('Decimal#greaterThanOrEqualTo works as expected', () => {
        assert.strictEqual(new Decimal(1e6).greaterThanOrEqualTo(1e6), true);
        assert.strictEqual(new Decimal('1e6').greaterThanOrEqualTo(1e5), true);
        assert.strictEqual(new Decimal(1000000).greaterThanOrEqualTo(1e7), false);
    });

    it('Decimal#lessThanOrEqualTo works as expected', () => {
        assert.strictEqual(new Decimal(1e6).lessThanOrEqualTo(1e6), true);
        assert.strictEqual(new Decimal('1e6').lessThanOrEqualTo(1e5), false);
        assert.strictEqual(new Decimal(1000000).lessThanOrEqualTo(1e7), true);
    });

    it('Decimal#greaterThan works as expected', () => {
        assert.strictEqual(new Decimal(1e6).greaterThan(1e6), false);
        assert.strictEqual(new Decimal('1e6').greaterThan(1e5), true);
        assert.strictEqual(new Decimal(1000000).greaterThan(1e7), false);
    });

    it('Decimal#lessThan works as expected', () => {
        assert.strictEqual(new Decimal(1e6).lessThan(1e6), false);
        assert.strictEqual(new Decimal('1e6').lessThan(1e5), false);
        assert.strictEqual(new Decimal(1000000).lessThan(1e7), true);
    });

    it('Decimal#compareTo works as expected', () => {
        assert.strictEqual(new Decimal('1e100').compareTo('1e99'), 1);
        assert.strictEqual(new Decimal('1e100').compareTo('1e101'), -1);
        assert.strictEqual(new Decimal('1e100').compareTo('1e100'), 0);
        assert.throws(() => new Decimal('1e100').compareTo(NaN));
        assert.throws(() => new Decimal('1e100').compareTo(Infinity));
    });

    it('Decimal#divideBy works as expected', () => {
        assert.strictEqual(new Decimal('1'.padEnd(100, '0')).dividedBy('1000000') === BigInt('1'.padEnd(94, '0')), true);
        assert.strictEqual(new Decimal('10000').dividedBy(1000) === 10n, true);
        assert.strictEqual(new Decimal(new Decimal(10000n)).dividedBy(new Decimal(1000n)) === 10n, true);
    });

    it('Decimal#equals works as expected', () => {
        assert.strictEqual(new Decimal('10e1000').equals(new Decimal('10e1000')), true);
        assert.strictEqual(new Decimal('2'.padEnd(7, '0')).equals(2000000), true);
        assert.strictEqual(new Decimal(100000000000000000000000000000n).equals(1e7), false);
    });

    it('Decimal#toString works exactly as BigInt.toString does', () => {
        assert.strictEqual(new Decimal(1e6).toString(), '1000000');
        assert.strictEqual(new Decimal(1e6).toString(2), '11110100001001000000'); // binary
    });

    it('Decimal#add works as expected', () => {
        assert.strictEqual(new Decimal('10000').add(6000).equals(16000), true);
        assert.strictEqual(new Decimal('100000').add('-50000').value, BigInt(50000));
        assert.strictEqual(new Decimal('5050').add(50).add('900').add(100n).value, BigInt(6100));
    });

    it('Decimal#minus works as expected', () => {
        assert.strictEqual(new Decimal('10000').minus(6000).equals(4000n), true);
        assert.strictEqual(new Decimal('100000').minus('-50000').value, BigInt(150000)); 
        assert.strictEqual(new Decimal(5050n).minus(50).minus(900).minus(new Decimal(100)).equals(4000), true);
    });

    it('Decimal#multiply works as expected', () => {
        assert.strictEqual(new Decimal('10000').multiply(6000).equals(6e7), true);
        assert.strictEqual(new Decimal('100000').multiply('-50000').value, BigInt('-5000000000')); 
        assert.strictEqual(new Decimal(5050n).multiply(50).multiply(900).multiply(new Decimal(100)).equals(22725000000), true);
    });

    it('Decimal#modulo works as expected', () => {
        assert.strictEqual(new Decimal('1'.padEnd(1000, '0')).modulo(10), 0n);
        assert.strictEqual(new Decimal('1'.padEnd(1000, '0')).modulo(9), 1n);
    });

    it('Decimal#negate works as expected', () => {
        assert.strictEqual(new Decimal('1'.padEnd(1000, '0')).negate() === BigInt('-1'.padEnd(1001, '0')), true);
        assert.strictEqual(new Decimal('-1').negate() === BigInt(1), true);
    });

    it('Decimal#root works as expected', () => {
        assert.strictEqual(new Decimal(144).root() === 12n, true);
        assert.strictEqual(new Decimal(169).root() === 13n, true);
        assert.strictEqual(new Decimal(27).root(3) === 3n, true);
    });

    it('Decimal#pow works as expected', () => {
        assert.strictEqual(new Decimal('2').pow(3) === 8n, true);
        assert.strictEqual(new Decimal('4').pow(3) === 64n, true);
        assert.throws(() => new Decimal('4').pow(-2));
    });

    it('static Decimal#pow works as expected', () => {
        assert.strictEqual(Decimal.pow(2, 3) === 8n, true);
        assert.throws(() => Decimal.pow(2, -2))
    });
});