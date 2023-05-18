import { Decimal } from 'decimal.js';

export function roundToFourSignificantNumbers(number: string): string {
    if (isNaN(Number(number))) {
        return number;
    }
    const [integerNumber]: string[] = number.split('.');

    if (Math.abs(Number(integerNumber)) > 0) {
        return new Decimal(number).toDecimalPlaces(2).toString();
    }

    return new Decimal(number).toSignificantDigits(4).toString();
}

export function formatNumber(number: string): string {
    if (isNaN(Number(number))) {
        return number;
    }

    const [integerNumber, decimalNumber]: string[] = number.split('.');
    const formattedInteger: string = integerNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (!decimalNumber) {
        return formattedInteger;
    }

    return `${formattedInteger}.${decimalNumber}`;
}
