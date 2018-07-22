const Swapi = require('./sw-api');

const consumables = [
  {
    label: 'hours',
    factor: 1
  },
  {
    label: 'day',
    factor: 24
  },
  {
    label: 'week',
    factor: 168
  },
  {
    label: 'month',
    factor: 730.0001
  },
  {
    label: 'year',
    factor: 8760.00240024
  }
]

/**
* Return the stop number of a starship
* @param {*} autonomy - Starship autonomy in hours
* @param {*} distance - Distance to go
* @param {*} mglt - Starship MGLT
*/
const getNumberStopByConsumable = (autonomy, distance, mglt) => {
  mglt = +mglt;
  if(distance <= mglt){
    return 0;
  }
  const duration = distance / mglt;
  return parseInt(duration / autonomy)
}


/**
* Normalize consumble in hours (e.g. input '2 days' return 48)
* @param {*} consumable
*/
const getConsumableByHour = (consumable) => {
  const qtde = +consumable.match(/\d+/g);
  const con = consumables.find(con => consumable.search(con.label) > -1);
  if(con && qtde > 0){
    return Math.round(+qtde * con.factor);
  }else{
    return 'N/A';
  }
}


/**
 * Get all starships and number of stops
 * @param {*} distance - Distance in MGLT
 */
const getAllByNumberStops = (distance) => {
  return Swapi
    .getAllStarship()
    .then(starships => {
      starships = starships.map(starship => {
        const autonomy = getConsumableByHour(starship.consumables);
        const numberStops = getNumberStopByConsumable(autonomy, distance, starship.MGLT);
        starship.numberStops = numberStops >= 0 ? numberStops : 'N/A';
        return starship;
      })
      
      const starshipsWithValue = starships
        .filter(starship => starship.numberStops !== 'N/A')
        .sort((st1, st2) => st1.numberStops - st2.numberStops)
        .reverse();

      const starshipNoValue = starships
        .filter(starship => starship.numberStops === 'N/A')
        .sort(orderByName);
      
      return Array.prototype.concat(starshipsWithValue, starshipNoValue)
    });
}

/**
 * Return all startship ordered by name
 */
const getAll = () => {
  return Swapi.getAllStarship().then(starships => {
    return starships.sort(orderByName)
  });
}

const orderByName = (a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);

module.exports = {getConsumableByHour, getNumberStopByConsumable, getAllByNumberStops, getAll};