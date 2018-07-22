const {getNumberStopByConsumable, getConsumableByHour} = require('../src/starship');
const Swapi = require('../src/sw-api');
const pkg = require('../package.json');
const exec = require('child_process').exec;

global.fetch = require('node-fetch');

describe('Starship stop calculator', () => {
  describe('smoke tests', () => {
    
    test('should exist a method sendRequest', () => {
      expect(Swapi.sendRequest).toBeDefined();
    })

    test('should exist a method getNumberStopByConsumable', () => {
      expect(getNumberStopByConsumable).toBeDefined();
    })  

    test('should exist a method getConsumableByHour', () => {
      expect(getConsumableByHour).toBeDefined();
    })  
  })

  describe('SW API', () => {
    describe('sendRequest', () => {
      const API = 'https://swapi.co/api';
      let spy;
      beforeEach(() => {
        spy = jest.spyOn(global, 'fetch');
      })
  
      afterEach(() => {
        spy.mockRestore();
      })
  
      test('should call fetch function', () => {
        Swapi.sendRequest(API);
        expect(spy).toHaveBeenCalled();
      })
  
      test('should call fetch with correct API URL', () => {
        const response = Swapi.sendRequest(API);
        expect(spy).toHaveBeenCalledWith(API);
      })
    })

    describe('getStarshipByPage', () => {
      test('should be call sendRequest', () => {
        const spyy = jest.spyOn(Swapi, 'sendRequest');

        Swapi.getStarshipByPage();
        expect(spyy).toHaveBeenCalled();
      })

    })
  })

  describe('Starship', () => {
    describe('getConsumableByHour', () => {
      test('should return N/A', () => {
        const consumable = getConsumableByHour('2 horas');
        expect(consumable).toBe('N/A')
      })

      test('should return 2 when passed 2 hours', () => {
        const consumable = getConsumableByHour('2 hours');
        expect(consumable).toBe(2)
      })

      test('should return 48 when passed 2 days', () => {
        const consumable = getConsumableByHour('2 days');
        expect(consumable).toBe(48)
      })

      test('should return 336 when passed 2 weeks', () => {
        const consumable = getConsumableByHour('2 weeks');
        expect(consumable).toBe(336)
      })

      test('should return 1460 when passed 2 moths', () => {
        const consumable = getConsumableByHour('2 months');
        expect(consumable).toBe(1460)
      })

      test('should return 17520 when passed 2 years', () => {
        const consumable = getConsumableByHour('2 years');
        expect(consumable).toBe(17520)
      })

    })
    describe('getNumberStopByConsumable', () => {
      test('should return 74 when passed 168, 1000000, and 80', () => {
        const numberOfStops = getNumberStopByConsumable(168, 1000000, 80);
        expect(numberOfStops).toBe(74);
      })
      test('should return 9 when passed 1460, 1000000, and 75', () => {
        const numberOfStops = getNumberStopByConsumable(1460, 1000000, 75);
        expect(numberOfStops).toBe(9);
      })
      test('should return 11 when passed 4380, 1000000, and 20', () => {
        const numberOfStops = getNumberStopByConsumable(4380, 1000000, 20);
        expect(numberOfStops).toBe(11);
      })
    })
  })


  describe('Main CLI', () => {
    test('should return version of program', (done) => {
      exec(`sw-starship --version`, (err, stdout, stderr) => {
        if(err) throw err;
        expect(stdout.replace('\n', '')).toBe(pkg.version)
        done();
      })
    })

    test('should validade param distance', (done) => {
      exec(`sw-starship calc`, (err, stdout, stderr) => {
        if(err) throw err;
        expect(stderr.includes('Distance')).toBe(true)
        done();
      })
    })
  })
});
