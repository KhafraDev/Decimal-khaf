# Decimal.Khafra
An implementation of Decimal.js that uses native BigInts.

# Trade-offs
* Floats are converted to integers as BigInt doesn't support floats.
* Old(er) browsers don't support BigInts.
* No trig, alias, or "useless" functions (such as ``toBinary``). Functions that also only work with ``numbers`` won't be included.

# Benefits
* Value can never be NaN or non-BigInt (factory method will throw an error if such a value is passed).
* Should be relatively faster since it uses native JS methods instead of modifying strings.