import { formatNumber, roundToFourSignificantNumbers } from './rounding.util';

describe('RoundingUtil', () => {
    it('should round to 2 decimals when integer part is more than 0', async () => {
        expect(roundToFourSignificantNumbers('1.234535')).toBe('1.23');
        expect(roundToFourSignificantNumbers('1.236535')).toBe('1.24');
        expect(roundToFourSignificantNumbers('-1.236535')).toBe('-1.24');
    });

    it('should round to 2 decimals when integer part is more than 0', async () => {
        expect(roundToFourSignificantNumbers('0.2345')).toBe('0.2345');
        expect(roundToFourSignificantNumbers('0.00230267678')).toBe('0.002303');
    });

    it('should format thousands when possible', async () => {
        expect(formatNumber('1000122.324')).toBe('1,000,122.324');
        expect(formatNumber('32.33224')).toBe('32.33224');
        expect(formatNumber('-1344.236535')).toBe('-1,344.236535');
    });
});
