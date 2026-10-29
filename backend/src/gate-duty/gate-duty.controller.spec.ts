import { Test, TestingModule } from '@nestjs/testing';
import { GateDutyController } from './gate-duty.controller';

describe('GateDutyController', () => {
  let controller: GateDutyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GateDutyController],
    }).compile();

    controller = module.get<GateDutyController>(GateDutyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
