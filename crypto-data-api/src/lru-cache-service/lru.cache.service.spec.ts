import { Test, TestingModule } from '@nestjs/testing';
import { LruCacheService } from './lru.cache.service';

describe('LruCacheService', () => {
    let service: LruCacheService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LruCacheService],
        }).compile();

        service = module.get<LruCacheService>(LruCacheService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should set and get', () => {
        service.set('key', 'value');
        expect(service.get('key')).toEqual('value');
    });

    it('should have correct size', () => {
        expect(service.size()).toEqual(0);
        service.set('key', 'value');
        expect(service.size()).toEqual(1);
    });

    it('should evict least recently used', () => {
        for (let i = 0; i < 51; i++) {
            service.set(i.toString(), i.toString());
        }
        expect(service.get('0')).toBeUndefined();
        expect(service.get('50')).toEqual('50');
    });
});
