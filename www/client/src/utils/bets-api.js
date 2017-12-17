import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export { getNflBetsApi };

function getNflBetsApi() {
  const url = `${BASE_URL}/api/bets/nfl`;
  return axios.get(url).then(response => response.data);
}