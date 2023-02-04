import { Controller, Post, Req } from '@nestjs/common';
import { BagService } from './bag.service';

@Controller()
export class BagController {
    constructor(private bg: BagService) {}

    @Post('/bag/calculate')
    async findBagSummary(@Req() request): Promise<{ bagSummary: string }> {
        return await this.bg.findBagSummary(
            request.body.query.map((e) => ({
                amount: Number(e.amount),
                coinOfficialName: e.coinFullName,
            })),
        );
    }
}
