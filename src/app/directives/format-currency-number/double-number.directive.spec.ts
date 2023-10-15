import { DoubleNumberDirective } from './double-number.directive';

describe('DoubleNumberDirective', () => {

  let directive: DoubleNumberDirective;
  let mockElementRef: any;
  let mockRenderer: any;

  beforeEach(() => {
    // Criando mock para ElementRef
    mockElementRef = {
      nativeElement: document.createElement('div')
    };

    // Criando mock para Renderer2
    mockRenderer = {
      setProperty: jasmine.createSpy('setProperty'),
    };

    // Instanciando a diretiva com os mocks
    directive = new DoubleNumberDirective(mockElementRef, mockRenderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

});
