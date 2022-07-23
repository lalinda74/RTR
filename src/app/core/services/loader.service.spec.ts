import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoaderService
      ]
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set component.visible if request count is 1', () => {
    service.isLoading.subscribe((state) => {
      expect(state).toBe(true);
    });
    const showFuncSpy = spyOn(service, 'show');

    service.requestCount++;
    service.show();

    expect(service.requestCount).toBe(1);
    expect(showFuncSpy).toHaveBeenCalled();
  });

  it('should hide loader if request count and response count is equal', () => {
    service.isLoading.subscribe((state) => {
      expect(state).toBe(false);
    });
    const hideFuncSpy = spyOn(service, 'hide');

    service.requestCount++;
    service.responseCounts++;
    service.hide();

    expect(service.requestCount).toBe(service.responseCounts);
    expect(service.requestCount).toBe(1);
    expect(service.responseCounts).toBe(1);
    expect(hideFuncSpy).toHaveBeenCalled();
  });
});
