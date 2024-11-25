import { Test, TestingModule } from '@nestjs/testing';
import { HeadQuarterController } from './head-quarters.controller';

describe('HeadQuatersController', () => {
  let controller: HeadQuarterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadQuarterController],
    }).compile();

    controller = module.get<HeadQuarterController>(HeadQuarterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
