import { Test, TestingModule } from '@nestjs/testing';
import { HeadQuarterService } from './head-quarters.service';

describe('HeadQuatersService', () => {
  let service: HeadQuarterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadQuarterService],
    }).compile();

    service = module.get<HeadQuarterService>(HeadQuarterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
