import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { GenerationService } from './generation.service';

describe('GenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerationService],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be created', inject([GenerationService], (service: GenerationService) => {
    expect(service).toBeTruthy();
  }));
});
