const url = 'https://nfl-api-data.p.rapidapi.com/nfl-whitelist';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'f014cc3394mshcaae187fa998756p11ec60jsn7d38a4ca5b89', // Replace with your key
    'x-rapidapi-host': 'nfl-api-data.p.rapidapi.com'
  }
};

(async () => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Whitelist data:', data);
  } catch (error) {
    console.error('Error fetching whitelist data:', error);
  }
})();
