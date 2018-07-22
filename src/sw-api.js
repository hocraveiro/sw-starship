global.fetch = require('node-fetch');
const SW_API_URL = 'https://swapi.co/api';

const Swapi = {
  sendRequest (url) {
    return fetch(url).then(data => data.json());
  },
  getStarshipByPage (page) {
    return this.sendRequest(`${SW_API_URL}/starships?page=${page}`);
  },
  getAllStarship (page = 1, starships = []) {
    return this.getStarshipByPage(page)
    .then(response => {
      starships = starships.concat(response.results);
      if(response.next){
        return this.getAllStarship(++page, starships);
      }
      return starships;
    })
  }  
}

module.exports = Swapi;