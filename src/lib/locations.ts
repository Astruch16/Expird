// Centralized location data for real estate boards, cities, and neighborhoods
// This data structure supports cascading filters: Board → City → Neighborhood

export interface LocationData {
  [board: string]: {
    [city: string]: string[];
  };
}

export const locationData: LocationData = {
  'Greater Vancouver': {
    'Bowen Island': ['Bowen Island'],
    'Burnaby East': ['Brentwood Park', 'Burnaby Lake', 'Capitol Hill BN', 'Cariboo', 'Cascade Heights', 'Deer Lake', 'Deer Lake Place', 'Government Road', 'Lakeview', 'Montecito', 'Parkcrest', 'Sperling-Duthie', 'The Crest', 'Vancouver Heights'],
    'Burnaby North': ['Forest Hills BN', 'Grouse Woods', 'Lake Terrace', 'North Esmond', 'Simon Fraser Univer.', 'Sperling-Duthie', 'Sullivan Heights', 'Westridge BN', 'Willingdon Heights'],
    'Burnaby South': ['Big Bend', 'Buckingham Heights', 'Edmonds BE', 'Forest Glen BS', 'Greentree Village', 'Highgate', 'Metrotown', 'Oaklands', 'Patterson', 'South Slope', 'Suncrest', 'Upper Deer Lake'],
    'Coquitlam': ['Burke Mountain', 'Canyon Springs', 'Cape Horn', 'Central Coquitlam', 'Chineside', 'Coquitlam East', 'Coquitlam West', 'Eagle Ridge CQ', 'Harbour Chines', 'Harbour Place', 'Heritage Mountain', 'Lincoln Park PoCo', 'Maillardville', 'Mary Hill', 'Meadow Brook', 'New Horizons', 'North Coquitlam', 'Ranch Park', 'River Springs', 'Riverwood', 'Scott Creek', 'Summitt View', 'Upper Eagle Ridge', 'Westwood Plateau', 'Westwood Summit CQ'],
    'Islands-Van. & Gulf': ['Barnston Island', 'Cortes Island', 'Galiano Island', 'Gambier', 'Hornby Island', 'Lasqueti Island', 'Mayne', 'Mitchell Island', 'N. Pender', 'Piers Island', 'Quadra Island', 'Salt Spring', 'Saturna', 'Savary Island', 'Texada Island', 'Thetis', 'Valdez Island', 'Other'],
    'Ladner': ['Delta Manor', 'East Delta', 'Hawthorne', 'Holly', 'Ladner Elementary', 'Ladner Rural', 'Neilsen Grove', 'Port Guichon', 'Scottsdale', 'Westham Island'],
    'Maple Ridge': ['Albion', 'Central Meadows', 'Cottonwood MR', 'East Central', 'Laity', 'Mid Meadows', 'Northeast', 'Northwest Maple Ridge', 'Silver Valley', 'Southwest Maple Ridge', 'Websters Corners', 'West Central', 'Whonnock'],
    'New Westminster': ['Brow Of The Hill', 'Downtown NW', 'Fraserview NW', 'Kelvin', 'Lower Lonsdale', 'Moody Park', 'North Arm', 'Port Royal', 'Queensborough', 'Quay', 'Sapperton', 'The Heights NW', 'Uptown NW', 'West End NW'],
    'North Vancouver': ['Blueridge NV', 'Boulevard', 'Braemar', 'Calverhall', 'Canyon Heights NV', 'Capilano Highlands', 'Capilano NV', 'Central BN', 'Central Lonsdale', 'Deep Cove', 'Dollarton', 'Edgemont', 'Forest Hills NV', 'Grand Boulevard', 'Hamilton', 'Indian Arm', 'Indian River', 'Lions Bay', 'Lower Lonsdale', 'Lynn Valley', 'Lynnmour', 'Maplewood', 'Mosquito Creek', 'Norgate', 'Northlands', 'Pemberton NV', 'Princess Park', 'Queensbury', 'Roche Point', 'Seymour', 'Seymour NV', 'Tempe', 'Upper Delbrook', 'Upper Lonsdale', 'Victoria Park', 'Westlynn', 'Westlynn Terrace', 'Windridge', 'Windsor Park NV', 'Woodlands-Sunshine-Cascade'],
    'Out of Town': ['Dawson', 'Harrison Hot Springs', 'Lower Mainland', 'Out of Area', 'Out of Province', 'Out of Town', 'Westside Road KE'],
    'Pemberton': ['Pemberton', 'Pemberton Heights', 'Pemberton NV'],
    'Pitt Meadows': ['Central Meadows', 'Mid Meadows', 'North Meadows PI', 'South Meadows'],
    'Port Coquitlam': ['Birchland Manor', 'Central Pt Coquitlam', 'Citadel PQ', 'Glenwood PQ', 'Lincoln Park PoCo', 'Lower Mary Hill', 'Mary Hill', 'Oxford Heights', 'Riverwood', 'Woodland Acres PQ'],
    'Port Moody': ['Anmore', 'Barber Street', 'Belcarra', 'College Park PM', 'Glenayre', 'Heritage Mountain', 'Heritage Woods PM', 'Ioco', 'Mountain Meadows', 'North Shore Pt Moody', 'Port Moody Centre'],
    'Richmond': ['Blundell', 'Boyd Park', 'Bridgeport RI', 'Brighouse', 'Brighouse South', 'Broadmoor', 'East Cambie', 'East Richmond', 'Garden City', 'Gilmore', 'Granville', 'Hamilton RI', 'Ironwood', 'Lackner', 'McNair', 'Metrotown', 'Mitchell Island', 'McLennan', 'McLennan North', 'Quilchena RI', 'Riverdale RI', 'Saunders', 'Sea Island', 'Seafair', 'South Arm', 'Steveston North', 'Steveston South', 'Steveston Village', 'Terra Nova', 'Thompson', 'West Cambie', 'Williams'],
    'Squamish': ['Brackendale', 'Britannia Beach', 'Dentville', 'Downtown SQ', 'Garibaldi Estates', 'Garibaldi Highlands', 'Hospital Hill', 'Northyards', 'Paradise Valley', 'Plateau', 'Ring Creek', 'Squamish Rural', 'Tantalus', 'University Highlands', 'Upper Squamish', 'Valleycliffe'],
    'Sunshine Coast': ['Egmont', 'Elphinstone', 'Gibsons', 'Halfmoon Bay', 'Hopkins', 'Keats Island', 'Langdale', 'Madeira Park', 'Pender Harbour', 'Roberts Creek', 'Sechelt', 'Sechelt District', 'Thormanby Island', 'West Sechelt'],
    'Tsawwassen': ['Beach Grove', 'Boundary Beach', 'Cliff Drive', 'English Bluff', 'Pebble Hill', 'Tsawwassen Central', 'Tsawwassen North', 'Tsawwassen East', 'Winskill'],
    'Vancouver East': ['Champlain Heights', 'Collingwood VE', 'Downtown VE', 'Fraserview VE', 'Grandview Woodland', 'Hastings', 'Hastings Sunrise', 'Killarney VE', 'Knight', 'Main', 'Mount Pleasant VE', 'Renfrew Heights', 'Renfrew VE', 'South Marine', 'South Vancouver', 'Strathcona', 'Victoria VE'],
    'Vancouver West': ['Arbutus', 'Cambie', 'Coal Harbour', 'Downtown VW', 'Dunbar', 'Fairview VW', 'False Creek', 'Kerrisdale', 'Kitsilano', 'MacKenzie Heights', 'Marpole', 'Mount Pleasant VW', 'Oakridge VW', 'Point Grey', 'Quilchena', 'S.W. Marine', 'Shaughnessy', 'South Cambie', 'South Granville', 'Southlands', 'University VW', 'West End VW', 'Yaletown'],
    'West Vancouver': ['Altamont', 'Ambleside', 'British Properties', 'Canterbury WV', 'Caulfeild', 'Cedardale', 'Chelsea Park', 'Cypress', 'Cypress Park Estates', 'Dundarave', 'Eagle Harbour', 'Eagleridge', 'Furry Creek', 'Gleneagles', 'Glenmore', 'Horseshoe Bay WV', 'Lions Bay', 'Olde Caulfeild', 'Panorama Village', 'Park Royal', 'Queens', 'Rockridge', 'Sandy Cove', 'Sentinel Hill', 'Upper Caulfeild', 'West Bay', 'Westhill', 'Westmount WV', 'Whytecliff', 'Whitby Estates'],
    'Whistler': ['Alta Vista', 'Bayshores', 'Benchlands', 'Black Tusk/Pinecrest', 'Blueberry Hill', 'Brio', 'Cheakamus Crossing', 'Green Lake Estates', 'Kadenwood', 'Nordic', 'Pemberton', 'Rainbow', 'Spring Creek', 'Spruce Grove', 'Stonehaven', 'Taluswood', 'Tapley\'s Farm', 'Wh. Cay Hts/Nic. Rdg', 'Whistler Creek', 'Whistler Highlands', 'Whistler Village', 'White Gold']
  },
  'Fraser Valley': {
    'Abbotsford': ['Abbotsford East', 'Abbotsford West', 'Aberdeen', 'Aldergrove Langley', 'Auguston', 'Bradner', 'Central Abbotsford', 'Clearbrook', 'Columbia Valley', 'Eagle Mountain', 'East Central', 'Hazelwood', 'Historic Downtown Abbotsford', 'Huntingdon Village', 'Immel', 'Kilgard', 'Mastqui', 'Matsqui Prairie', 'McMillan Island', 'Mill Lake', 'Mt Lehman', 'Old Clayburn', 'Old Orchard', 'Old Yale Rd', 'Poplar', 'Sandy Hill', 'Sumas Mountain', 'Sumas Prairie', 'West Abbotsford', 'Western Hillsides'],
    'Cloverdale': ['Cloverdale BC', 'Clayton', 'East Newton', 'Sunnyside Park Surrey', 'West Cloverdale'],
    'Langley': ['Aldergrove Langley', 'Brookswood Langley', 'Campbell Valley', 'County Line Glen Valley', 'Fort Langley', 'Langley City', 'Murrayville', 'Otter District', 'Salmon River', 'Walnut Grove', 'Willoughby Heights', 'Yorkson'],
    'Mission': ['Cedar Valley', 'Durieu', 'Ferndale', 'Hatzic', 'Lake Errock', 'McConnell Creek', 'Midtown Mission', 'Mission BC', 'Mission Central', 'Northwest Maple Ridge', 'Ruskin', 'Silverdale', 'Stave Falls', 'Stave Lake', 'Steelhead'],
    'N. Delta': ['Annieville', 'Bear Creek Green Timbers', 'Nordel', 'Scottsdale', 'Sunbury', 'Sunshine Hills Woods'],
    'North Surrey': ['Bear Creek Green Timbers', 'Bolivar Heights', 'Bridgeview', 'City Central', 'Guildford', 'Queen Mary Park Surrey', 'Sullivan Station', 'Whalley'],
    'South Surrey White Rock': ['Crescent Bch Ocean Pk.', 'Crescent Beach/Crescent Heights', 'East Beach', 'Elgin Chantrell', 'Grandview Surrey', 'Hazelmere', 'King George Corridor', 'Morgan Creek', 'Ocean Park', 'Pacific Douglas', 'Rosemary Heights', 'Sunnyside Park Surrey', 'West Beach', 'Westside Road KE', 'White Rock'],
    'Surrey': ['Barnston Island', 'Bear Creek Green Timbers', 'Bolivar Heights', 'Bridgeview', 'Cedar Hills', 'Cloverdale BC', 'East Newton', 'Fleetwood', 'Fleetwood Tynehead', 'Fraser Heights', 'Green Timbers', 'Guildford', 'Hazelmere', 'Newton', 'Panorama Ridge', 'Queen Mary Park Surrey', 'South Surrey', 'Sullivan Station', 'Surrey Central', 'Tynehead', 'West Newton', 'Whalley']
  },
  'Chilliwack': {
    'Agassiz': ['Agassiz'],
    'Chilliwack': ['Atchelitz', 'Chilliwack Downtown', 'Chilliwack E Young-Yale', 'Chilliwack N Yale-Well', 'Chilliwack River Valley', 'Fairfield Island', 'Greendale', 'Marble Hill', 'Mount Cheam', 'Promontory', 'Sardis', 'South Chilliwack', 'Vedder S Watson-Promontory', 'Yarrow'],
    'Cultus Lake & Area': ['Columbia Valley', 'Cultus Lake'],
    'East Chilliwack': ['Bridal Falls', 'Popkum', 'Rosedale'],
    'Fraser Canyon': ['Boston Bar', 'Fraser Canyon', 'Lytton'],
    'Harrison Lake': ['Big Silver', 'Harrison Hot Springs', 'Harrison Lake', 'Harrison Mills'],
    'Hope & Area': ['Flood', 'Hope', 'Hope & Area', 'Hope Kawkawa Lake', 'Hope Silver Creek', 'Hope Town', 'Kawkawa Lake', 'Laidlaw', 'Silver Creek', 'Sunshine Valley'],
    'Sardis': ['Chilliwack E Young-Yale', 'Promontory', 'Sardis', 'Sardis East Vedder Rd', 'Sardis West Vedder Mtn', 'Vedder S Watson-Promontory'],
    'Yarrow': ['Greendale', 'Yarrow']
  }
};

// Helper function to get all boards
export function getBoards(): string[] {
  return Object.keys(locationData);
}

// Helper function to get cities for a specific board
export function getCitiesForBoard(board: string): string[] {
  if (!board || !locationData[board]) return [];
  return Object.keys(locationData[board]).sort();
}

// Helper function to get neighborhoods for a specific city within a board
export function getNeighborhoodsForCity(board: string, city: string): string[] {
  if (!board || !city || !locationData[board] || !locationData[board][city]) return [];
  return locationData[board][city].sort();
}

// Helper function to get all cities across all boards
export function getAllCities(): string[] {
  const cities = new Set<string>();
  Object.values(locationData).forEach(boardCities => {
    Object.keys(boardCities).forEach(city => cities.add(city));
  });
  return Array.from(cities).sort();
}

// Helper function to get all neighborhoods across all boards and cities
export function getAllNeighborhoods(): string[] {
  const neighborhoods = new Set<string>();
  Object.values(locationData).forEach(boardCities => {
    Object.values(boardCities).forEach(cityNeighborhoods => {
      cityNeighborhoods.forEach(neighborhood => neighborhoods.add(neighborhood));
    });
  });
  return Array.from(neighborhoods).sort();
}

// Helper function to find which board a city belongs to
export function findBoardForCity(city: string): string | null {
  for (const [board, cities] of Object.entries(locationData)) {
    if (cities[city]) {
      return board;
    }
  }
  return null;
}

// Helper function to find which board and city a neighborhood belongs to
export function findLocationForNeighborhood(neighborhood: string): { board: string; city: string } | null {
  for (const [board, cities] of Object.entries(locationData)) {
    for (const [city, neighborhoods] of Object.entries(cities)) {
      if (neighborhoods.includes(neighborhood)) {
        return { board, city };
      }
    }
  }
  return null;
}
