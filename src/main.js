#!/usr/bin/env node

const program = require('commander');
const Starship = require('./starship');
const pkg = require('../package.json');
const ora = require('ora');

program
  .version('1.0.0', '-v, --version')
  .description(pkg.description);

program
  .command('calc')
  .alias('c')
  .option('-d', 'Distance in MGLT')
  .description('Calculate number of stops in MGLT.')
  .action(handleCalcAction);
  
program
  .command('list')
  .alias('ls')
  .description('List all SW starships.')
  .action(handleListAction);
  
  
program.parse(process.argv);

function handleListAction(){
  const spinner = ora({
    text: 'Fetching all starships, wait please...',
    color: 'yellow'
  });

  spinner.start();

  Starship
    .getAll()
    .then(starships => {
      spinner.stop();
      const starshipsPrint = starships.map(starship => {
        return {
          'Name': starship.name,
          'Consumables': starship.consumables,
          'MGLT': starship.MGLT
        }
      })
      console.table(starshipsPrint)
    })
    .catch(error => {
      spinner.stop();
      console.error('Something wrong :(')
      console.error(error.message);
    })
}

function handleCalcAction(distance) {  
  
  distance = +distance;
  if(!Number.isInteger(distance)){
    console.error('Distance should be a integer number!');
    return true;
  }
  
  const spinner = ora({
    text: 'Calculating number of stops, wait please!',
    color: 'yellow'
  });
  
  spinner.start();
  
  Starship
    .getAllByNumberStops(distance)
    .then(starships => {
      spinner.stop();
      const starshipsPrint = starships.map(starship => {
        return {
          'Name': starship.name,
          'Number of stops': starship.numberStops,
          'Consumables': starship.consumables,
          'MGLT': starship.MGLT
        }
      })
      console.table(starshipsPrint)
    })
    .catch(error => {
      spinner.stop();
      console.error('Something wrong :(')
      console.error(error.message);
    })
}  
