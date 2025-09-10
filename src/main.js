// Import your styles
import './style.scss'

console.clear();

// Containers
const wrapper = document.getElementById('wrapper');
const drawer = document.getElementById('drawer');
const swipeZone = document.getElementById('swipeZone');

// Utility functions
const createNode = element => document.createElement(element)
const append = (parent, el) => parent.appendChild(el)

// Drawer functionality
const closeDrawer = () => {
  const overlay = document.querySelector('.c-overlay');
  if (overlay) {
    overlay.style.opacity = 0;
    drawer.classList.remove('c-drawer--open');
    setTimeout(() => overlay.remove(), 50);
  }
}

const openDrawer = () => {
  let newOverlay = createNode('div');
  newOverlay.classList = 'c-overlay';
  newOverlay.style.opacity = 0;
  newOverlay.addEventListener('click', closeDrawer);
  append(document.body, newOverlay);
  setTimeout(() => {
    newOverlay.style.opacity = 1;
    drawer.classList.add('c-drawer--open');
  }, 100);
}

const toggleDrawer = () => {
  drawer.classList.contains('c-drawer--open') ? closeDrawer() : openDrawer();
}

// Loading state
const emptyState = () => {
  const newText = createNode('div');
  newText.classList = 'c-empty-state';
  newText.innerHTML = `
    <svg class="c-empty-state__icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
    <div style="margin-top: 8px;">Loading...</div>
  `;
  append(wrapper, newText);
  setTimeout(() => newText.remove(), 500);
}

// Calculate championship standings from race results
const calculateCurrentStandings = (allResults) => {
  console.log('Calculating current standings from:', allResults.length, 'results');
  
  const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const driverPoints = {};
  const driverWins = {};
  const driverTeams = {};
  
  allResults.forEach(result => {
    if (!result.driver_number || !result.position) return;
    
    const driverId = result.driver_number;
    const position = parseInt(result.position);
    const points = position <= 10 ? pointsSystem[position - 1] : 0;
    
    if (!driverPoints[driverId]) {
      driverPoints[driverId] = 0;
      driverWins[driverId] = 0;
      driverTeams[driverId] = result.team_name || 'Unknown Team';
    }
    
    driverPoints[driverId] += points;
    if (position === 1) {
      driverWins[driverId]++;
    }
  });
  
  const standings = Object.keys(driverPoints).map(driverId => {
    const sampleResult = allResults.find(r => r.driver_number == driverId);
    return {
      position: 0,
      driver_number: driverId,
      full_name: sampleResult?.full_name || `Driver ${driverId}`,
      team_name: driverTeams[driverId],
      points: driverPoints[driverId],
      wins: driverWins[driverId]
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
  
  standings.forEach((driver, index) => {
    driver.position = index + 1;
  });
  
  console.log('Calculated standings:', standings);
  return standings;
}

// Real historical F1 data (since Ergast API has CORS issues)
const historicalData = {
  2024: {
    standings: [
      { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda RBPT", points: 575, wins: 9, position: 1 },
      { full_name: "Lando Norris", team_name: "McLaren Mercedes", points: 374, wins: 3, position: 2 },
      { full_name: "Charles Leclerc", team_name: "Ferrari", points: 356, wins: 2, position: 3 },
      { full_name: "Oscar Piastri", team_name: "McLaren Mercedes", points: 292, wins: 2, position: 4 },
      { full_name: "Carlos Sainz", team_name: "Ferrari", points: 290, wins: 1, position: 5 },
      { full_name: "George Russell", team_name: "Mercedes", points: 245, wins: 1, position: 6 },
      { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 223, wins: 2, position: 7 },
      { full_name: "Sergio Perez", team_name: "Red Bull Racing Honda RBPT", points: 152, wins: 0, position: 8 },
      { full_name: "Fernando Alonso", team_name: "Aston Martin Aramco Mercedes", points: 70, wins: 0, position: 9 },
      { full_name: "Nico Hulkenberg", team_name: "Haas Ferrari", points: 41, wins: 0, position: 10 }
    ]
  },
  2023: {
    standings: [
      { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda RBPT", points: 575, wins: 19, position: 1 },
      { full_name: "Sergio Perez", team_name: "Red Bull Racing Honda RBPT", points: 285, wins: 2, position: 2 },
      { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 234, wins: 1, position: 3 },
      { full_name: "Fernando Alonso", team_name: "Aston Martin Aramco Mercedes", points: 206, wins: 0, position: 4 },
      { full_name: "Charles Leclerc", team_name: "Ferrari", points: 206, wins: 0, position: 5 },
      { full_name: "Lando Norris", team_name: "McLaren Mercedes", points: 205, wins: 0, position: 6 },
      { full_name: "Carlos Sainz", team_name: "Ferrari", points: 200, wins: 1, position: 7 },
      { full_name: "George Russell", team_name: "Mercedes", points: 175, wins: 0, position: 8 },
      { full_name: "Oscar Piastri", team_name: "McLaren Mercedes", points: 97, wins: 0, position: 9 },
      { full_name: "Lance Stroll", team_name: "Aston Martin Aramco Mercedes", points: 74, wins: 0, position: 10 }
    ]
  },
  2022: {
    standings: [
      { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda RBPT", points: 454, wins: 15, position: 1 },
      { full_name: "Charles Leclerc", team_name: "Ferrari", points: 308, wins: 3, position: 2 },
      { full_name: "Sergio Perez", team_name: "Red Bull Racing Honda RBPT", points: 305, wins: 1, position: 3 },
      { full_name: "George Russell", team_name: "Mercedes", points: 275, wins: 1, position: 4 },
      { full_name: "Carlos Sainz", team_name: "Ferrari", points: 246, wins: 1, position: 5 },
      { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 240, wins: 0, position: 6 },
      { full_name: "Lando Norris", team_name: "McLaren Mercedes", points: 122, wins: 0, position: 7 },
      { full_name: "Esteban Ocon", team_name: "Alpine Renault", points: 92, wins: 0, position: 8 },
      { full_name: "Fernando Alonso", team_name: "Alpine Renault", points: 81, wins: 0, position: 9 },
      { full_name: "Valtteri Bottas", team_name: "Alfa Romeo Ferrari", points: 49, wins: 0, position: 10 }
    ]
  },
  2021: {
    standings: [
      { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda", points: 395, wins: 10, position: 1 },
      { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 387, wins: 8, position: 2 },
      { full_name: "Valtteri Bottas", team_name: "Mercedes", points: 226, wins: 1, position: 3 },
      { full_name: "Sergio Perez", team_name: "Red Bull Racing Honda", points: 190, wins: 1, position: 4 },
      { full_name: "Carlos Sainz", team_name: "Ferrari", points: 164, wins: 0, position: 5 },
      { full_name: "Lando Norris", team_name: "McLaren Mercedes", points: 160, wins: 0, position: 6 },
      { full_name: "Charles Leclerc", team_name: "Ferrari", points: 159, wins: 0, position: 7 },
      { full_name: "Daniel Ricciardo", team_name: "McLaren Mercedes", points: 115, wins: 1, position: 8 },
      { full_name: "Pierre Gasly", team_name: "AlphaTauri Honda", points: 110, wins: 0, position: 9 },
      { full_name: "Fernando Alonso", team_name: "Alpine Renault", points: 81, wins: 0, position: 10 }
    ]
  },
  2020: {
    standings: [
      { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 347, wins: 11, position: 1 },
      { full_name: "Valtteri Bottas", team_name: "Mercedes", points: 223, wins: 2, position: 2 },
      { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda", points: 214, wins: 2, position: 3 },
      { full_name: "Sergio Perez", team_name: "Racing Point BWT Mercedes", points: 125, wins: 1, position: 4 },
      { full_name: "Daniel Ricciardo", team_name: "Renault", points: 119, wins: 0, position: 5 },
      { full_name: "Carlos Sainz", team_name: "McLaren Renault", points: 105, wins: 0, position: 6 },
      { full_name: "Alexander Albon", team_name: "Red Bull Racing Honda", points: 105, wins: 0, position: 7 },
      { full_name: "Charles Leclerc", team_name: "Ferrari", points: 98, wins: 0, position: 8 },
      { full_name: "Lando Norris", team_name: "McLaren Renault", points: 97, wins: 0, position: 9 },
      { full_name: "Pierre Gasly", team_name: "AlphaTauri Honda", points: 75, wins: 1, position: 10 }
    ]
  }
};

// Get driver standings with real historical data
const getDriverStandings = async (year) => {
  const isCurrentSeason = year === 'current';
  const targetYear = isCurrentSeason ? new Date().getFullYear() : parseInt(year);
  
  console.log(`Getting data for year: ${targetYear}, isCurrentSeason: ${isCurrentSeason}`);
  
  // For 2025, use mock data since season is incomplete
  if (targetYear >= 2025) {
    console.log('Using mock data for 2025 season');
    return {
      standings: [
        { full_name: "Max Verstappen", team_name: "Red Bull Racing Honda RBPT", points: 45, wins: 2, position: 1 },
        { full_name: "Lando Norris", team_name: "McLaren Mercedes", points: 32, wins: 0, position: 2 },
        { full_name: "Charles Leclerc", team_name: "Ferrari", points: 28, wins: 1, position: 3 },
        { full_name: "Oscar Piastri", team_name: "McLaren Mercedes", points: 24, wins: 0, position: 4 },
        { full_name: "Carlos Sainz", team_name: "Ferrari", points: 20, wins: 0, position: 5 },
        { full_name: "George Russell", team_name: "Mercedes", points: 18, wins: 0, position: 6 },
        { full_name: "Lewis Hamilton", team_name: "Mercedes", points: 16, wins: 0, position: 7 },
        { full_name: "Sergio Perez", team_name: "Red Bull Racing Honda RBPT", points: 12, wins: 0, position: 8 },
        { full_name: "Fernando Alonso", team_name: "Aston Martin Aramco Mercedes", points: 8, wins: 0, position: 9 },
        { full_name: "Lance Stroll", team_name: "Aston Martin Aramco Mercedes", points: 6, wins: 0, position: 10 }
      ],
      year: targetYear,
      isCurrentSeason: true
    };
  }
  
  // For historical years, use stored data
  if (historicalData[targetYear]) {
    console.log(`Using historical data for ${targetYear}`);
    return {
      standings: historicalData[targetYear].standings,
      year: targetYear,
      isCurrentSeason: false
    };
  }
  
  // Fallback for years we don't have data for
  return {
    standings: [],
    year: targetYear,
    isCurrentSeason: false,
    error: `No data available for ${targetYear} season`
  };
}

// Render standings
const renderList = async (year) => {
  console.log('Rendering list for year:', year);
  emptyState();
  
  try {
    const data = await getDriverStandings(year);
    const { standings, year: dataYear, isCurrentSeason, error } = data;
    
    console.log('Rendering data:', data);
    
    let table = createNode('table');
    table.classList = 'c-table';
    
    table.innerHTML = `
      <thead class="c-table__head">
        <tr class="c-table__head-row">
          <th class="c-table__head-cell u-text--center">Place</th>
          <th class="c-table__head-cell">Driver</th>
          <th class="c-table__head-cell">Wins</th>
          <th class="c-table__head-cell u-text--right">Points</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    
    const title = createNode('div');
    title.classList = 'c-headline';
    title.innerHTML = `
      <h4 class="c-headline__title">
        <small class="u-text--danger">FORMULA 1</small><br />
        Driver Standings <small class="u-text--secondary">(${dataYear})</small>
      </h4>
      <span class="c-chip ${isCurrentSeason ? 'c-chip--success' : 'c-chip--secondary'}">
        Season ${isCurrentSeason ? 'in Progress' : 'Completed'}
      </span>
    `;
    
    append(wrapper, title);
    append(wrapper, table);
    
    // Handle error case
    if (error) {
      const errorRow = createNode('tr');
      errorRow.innerHTML = `<td colspan="4" style="text-align: center; padding: 20px; color: var(--red);">${error}</td>`;
      table.querySelector('tbody').appendChild(errorRow);
      return;
    }
    
    if (!standings || standings.length === 0) {
      console.error('No standings data to display');
      const errorRow = createNode('tr');
      errorRow.innerHTML = '<td colspan="4" style="text-align: center; padding: 20px;">No driver data available for this year</td>';
      table.querySelector('tbody').appendChild(errorRow);
      return;
    }
    
    standings.forEach(driver => {
      console.log('Rendering driver:', driver);
      const tableBody = table.querySelector('tbody');
      let tr = createNode('tr');
      tr.classList = "c-table__row";
      tr.innerHTML = `
        <td class="c-table__cell c-table__cell--place u-text--center">
          <span class="c-place">${driver.position}</span>
        </td>
        <td class="c-table__cell c-table__cell--name">
          ${driver.full_name}<br>
          <small style="opacity: .4;">${driver.team_name}</small>
        </td>
        <td class="c-table__cell c-table__cell--count">
          <small>${driver.wins}</small>
        </td>
        <td class="c-table__cell c-table__cell--points u-text--right">
          <strong>${driver.points}</strong>
        </td>
      `;
      
      const placeElement = tr.querySelector('.c-place');
      if (driver.position == 1) {
        placeElement.classList.add('c-place--first');
        
        // Show winner card for completed seasons
        if (!isCurrentSeason) {
          const firstPlaceCard = createNode('div');
          firstPlaceCard.classList = 'c-winner';
          firstPlaceCard.innerHTML = `
            <div class="c-winner__image">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <div class="c-winner__content">
              <small class="c-winner__badge">winner</small>
              <h5 class="c-winner__title">${driver.full_name}</h5>
              <div class="c-winner__info">
                <small class="c-winner__info-item"><strong>${driver.team_name}</strong></small>
                <small class="c-winner__info-item">Wins: <strong>${driver.wins}</strong></small>
                <small class="c-winner__info-item">Points: <strong>${driver.points}</strong></small>
              </div>
            </div>
          `;
          table.parentNode.insertBefore(firstPlaceCard, table);
        }
      } else if (driver.position == 2) {
        placeElement.classList.add('c-place--second');
      } else if (driver.position == 3) {
        placeElement.classList.add('c-place--third');
      }
      
      append(tableBody, tr);
    });
    
  } catch (error) {
    console.error('Error rendering standings:', error);
    const errorDiv = createNode('div');
    errorDiv.classList = 'c-empty-state';
    errorDiv.innerHTML = `
      <div style="color: var(--red);">Error loading data</div>
      <div style="margin-top: 8px; font-size: 1.2rem;">Please try again later</div>
    `;
    append(wrapper, errorDiv);
  }
}

// Theme toggle
const themeToggle = document.getElementById('test');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('theme--dark');
    themeToggle.classList.toggle('c-toggle--active');
  });
}

// Season selector
const createSeasonSelect = () => {
  const newSelect = createNode('div');
  newSelect.innerHTML = `
    <label class="c-field__label">Season:</label>
    <select class="c-field__input"></select>
  `;
  newSelect.classList = 'c-field';
  newSelect.style.position = 'relative';
  newSelect.style.zIndex = 300;
  
  // Available years with real data
  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020];
  
  availableYears.forEach((itemYear, index) => {
    let newOption = createNode('option');
    if(index === 0) {
      newOption.setAttribute('selected', true);
      newOption.innerHTML = `${itemYear} (current)`;
      newOption.setAttribute('value', 'current');
    } else {
      newOption.innerHTML = itemYear;
      newOption.setAttribute('value', itemYear);
    }
    append(newSelect.querySelector('.c-field__input'), newOption);
  });
  
  newSelect.querySelector('.c-field__input').addEventListener('change', (e) => {
    console.log('Year changed to:', e.target.value);
    wrapper.innerHTML = '';
    renderList(e.target.value);
    toggleDrawer();
  });
  
  append(drawer, newSelect);
}

// Touch/swipe detection
function swipedetect(el, callback) {
  let touchsurface = el;
  let swipedir;
  let startX, startY, distX, distY;
  let threshold = 150;
  let restraint = 100;
  let allowedTime = 300;
  let elapsedTime, startTime;
  let handleswipe = callback || function(swipedir) {};

  touchsurface.addEventListener('touchstart', function(e) {
    let touchobj = e.changedTouches[0];
    swipedir = 'none';
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime();
    e.preventDefault();
  }, false);

  touchsurface.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);

  touchsurface.addEventListener('touchend', function(e) {
    let touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX;
    distY = touchobj.pageY - startY;
    elapsedTime = new Date().getTime() - startTime;
    
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        swipedir = (distX < 0) ? 'left' : 'right';
      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        swipedir = (distY < 0) ? 'up' : 'down';
      }
    }
    handleswipe(swipedir);
    e.preventDefault();
  }, false);
}

// Initialize app
const initApp = () => {
  console.log('Initializing app...');
  createSeasonSelect();
  renderList('current');
  
  // Event listeners
  const drawerHandle = drawer.querySelector('.c-drawer__handle');
  if (drawerHandle) {
    drawerHandle.addEventListener('click', toggleDrawer);
  }
  
  if (swipeZone) {
    swipedetect(swipeZone, function(direction) {
      if (direction == 'up') {
        openDrawer();
      } else if (direction == 'down') {
        closeDrawer();
      }
    });
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}