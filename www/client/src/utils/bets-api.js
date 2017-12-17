import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export {openBets};

function getNflBets() {
  const url = `${BASE_URL}/api/bets/nfl`;
  return axios.get(url).then(response => response.data);
}