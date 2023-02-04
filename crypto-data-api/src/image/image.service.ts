import { Injectable } from '@nestjs/common';
import {
    findBtc2YearMovingAverage as _findBtc2YearMovingAverage,
    findRainbowChart as _findRainbowChart,
} from 'crypto-data';
import { Btc2YearMovingAverage } from 'crypto-data/lib/src/process/crypto-images';

@Injectable()
export class ImageService {
    async findRainbowChart(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img } = await _findRainbowChart();
        return { originUrl, base64Img };
    }

    async findBtc2YearMovingAverage(): Promise<{ originUrl: string; base64Img: string }> {
        const { originUrl, base64Img }: Btc2YearMovingAverage = await _findBtc2YearMovingAverage();
        return { originUrl, base64Img };
    }
}
