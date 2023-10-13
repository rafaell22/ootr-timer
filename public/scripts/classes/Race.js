export default class Race {
  constructor({
    name,
    status,
    data_url,
    info,
    entrants,
    opened_at,
    started_at,
  }) {
    this.name = name;
    this.status = status.value;
    this.data_url = data_url;
    this.info = info;
    this.entrants = entrants;
    this.opened_at = opened_at;
    this.started_at = started_at;
    this.startDelay = 0;
  }

  /**
   * Load all races in a category
   * @param {string} category
   *
   * @returns {Promise<Race[]>}
   */
  static async loadRacesByCategory(category) {
    let racesResult;
    try {
      racesResult = await fetch(`http://localhost:8080/races/${category}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      const racesResultJson = await racesResult.json();
      const races = [];
      for(const race of racesResultJson) {
          races.push(new Race(race));
      }
      return races;
    } catch(errorGettingRacesList) {
        console.log('ERROR');
        console.log(errorGettingRacesList.stack);
    }
  }

  /**
   * Load all categories
   * 
   * @returns {Promise<object[]>}
   */
  static async loadCategories() {
    let allRacesResult;
    try {
      allRacesResult = await fetch(`http://localhost:8080/races/data`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      const allRaces = (await allRacesResult.json()).races;
      const categoriesBySlug = {};
      const categories = [];
      for(const race of allRaces) {
        if(!categoriesBySlug[race.category.slug]) {
          categoriesBySlug[race.category.slug] = true;
          categories.push(race.category);
        }
      }
      return categories;
    } catch(errorGettingRacesList) {
        console.log('ERROR');
        console.log(errorGettingRacesList.stack);
    }
  }

  /**
   * Load all races details
   * @param {string} raceUrl
   *
   * @returns {Promise<object[]>}
   */
  static async loadRaceDetails(raceUrl) {
    let raceDetailsResult;
    const category = raceUrl.split('/')[0];
    const raceSlug = raceUrl.split('/')[1];

    try {
      raceDetailsResult = await fetch(`http://localhost:8080/races/details/${category}/${raceSlug}/data`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      const raceDetails = await raceDetailsResult.json();
      return raceDetails;
    } catch(errorGettingRacesList) {
        console.log('ERROR');
        console.log(errorGettingRacesList.stack);
    }
  }
}
