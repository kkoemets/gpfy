import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller()
export class ImageController {
    constructor(private ic: ImageService) {}

    @Get('/images/2YearMovingAvg')
    async findBtc2YearMovingAverage(): Promise<{ originUrl: string; base64Img: string }> {
        return await this.ic.findBtc2YearMovingAverage();
    }

    @Get('/images/rainbow')
    async findRainbowChart(): Promise<{ originUrl: string; base64Img: string }> {
        return await this.ic.findRainbowChart();
    }
}
