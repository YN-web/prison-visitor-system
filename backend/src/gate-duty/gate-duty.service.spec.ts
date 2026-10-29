import { Test, TestingModule } from '@nestjs/testing';
import { GateDutyService } from './gate-duty.service';

describe('GateDutyService', () => {
  let service: GateDutyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GateDutyService],
    }).compile();

    service = module.get<GateDutyService>(GateDutyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
