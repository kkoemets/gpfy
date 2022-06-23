import { Injectable } from '@nestjs/common';
import { findBtc2YearMovingAverage } from 'crypto-data';

@Injectable()
export class DataService {
    findRainbowChart() {
        const findBtc2YearMovingAverage1 = findBtc2YearMovingAverage();
    }
}
