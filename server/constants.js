// Card Types
export const CardType = {
  PROPERTY: 'PROPERTY',
  ACTION: 'ACTION',
  MONEY: 'MONEY',
};

// Property Colors
export const PropertyColor = {
  PINK: 'pink',
  DARK_BLUE: 'darkBlue',
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
  BLACK: 'black',
  LIGHT_GREEN: 'lightGreen',
};

// Property Set Definitions (Indian Cities & Landmarks)
export const PropertySets = {
  [PropertyColor.PINK]: {
    name: 'Jaipur',
    color: PropertyColor.PINK,
    setSize: 2,
    value: 2, // ₹2Cr per card
    cards: [
      { name: 'Hawa Mahal', color: PropertyColor.PINK, value: 2 },
      { name: 'City Palace', color: PropertyColor.PINK, value: 2 },
    ],
  },
  [PropertyColor.DARK_BLUE]: {
    name: 'Mumbai',
    color: PropertyColor.DARK_BLUE,
    setSize: 2,
    value: 4, // ₹4Cr per card
    cards: [
      { name: 'Antilia', color: PropertyColor.DARK_BLUE, value: 4 },
      { name: 'Sea Link', color: PropertyColor.DARK_BLUE, value: 4 },
    ],
  },
  [PropertyColor.GREEN]: {
    name: 'Delhi',
    color: PropertyColor.GREEN,
    setSize: 3,
    value: 4, // ₹4Cr per card
    cards: [
      { name: 'Lutyens Delhi', color: PropertyColor.GREEN, value: 4 },
      { name: 'India Gate', color: PropertyColor.GREEN, value: 4 },
      { name: 'Red Fort', color: PropertyColor.GREEN, value: 4 },
    ],
  },
  [PropertyColor.YELLOW]: {
    name: 'Bangalore',
    color: PropertyColor.YELLOW,
    setSize: 3,
    value: 3, // ₹3Cr per card
    cards: [
      { name: 'Indiranagar', color: PropertyColor.YELLOW, value: 3 },
      { name: 'Tech Park', color: PropertyColor.YELLOW, value: 3 },
      { name: 'Cubbon Park', color: PropertyColor.YELLOW, value: 3 },
    ],
  },
  [PropertyColor.RED]: {
    name: 'Kolkata',
    color: PropertyColor.RED,
    setSize: 3,
    value: 3, // ₹3Cr per card
    cards: [
      { name: 'Howrah Bridge', color: PropertyColor.RED, value: 3 },
      { name: 'Victoria Memorial', color: PropertyColor.RED, value: 3 },
      { name: 'Park Street', color: PropertyColor.RED, value: 3 },
    ],
  },
  [PropertyColor.BLACK]: {
    name: 'Transport',
    color: PropertyColor.BLACK,
    setSize: 4,
    value: 2, // ₹2Cr per card
    cards: [
      { name: 'Metro', color: PropertyColor.BLACK, value: 2 },
      { name: 'Rickshaw', color: PropertyColor.BLACK, value: 2 },
      { name: 'Local Train', color: PropertyColor.BLACK, value: 2 },
      { name: 'Auto', color: PropertyColor.BLACK, value: 2 },
    ],
  },
  [PropertyColor.LIGHT_GREEN]: {
    name: 'Utilities',
    color: PropertyColor.LIGHT_GREEN,
    setSize: 2,
    value: 2, // ₹2Cr per card
    cards: [
      { name: 'Adani Power', color: PropertyColor.LIGHT_GREEN, value: 2 },
      { name: 'Jio Fiber', color: PropertyColor.LIGHT_GREEN, value: 2 },
    ],
  },
};

// Action Card Definitions
export const ActionCards = {
  SCAM_1992: {
    id: 'SCAM_1992',
    name: 'Scam 1992',
    description: 'Steal a completed property set from any opponent',
    type: CardType.ACTION,
    quantity: 2,
  },
  ABBA_NAHI_MANENGE: {
    id: 'ABBA_NAHI_MANENGE',
    name: 'Abba Nahi Manenge',
    description: 'Just Say No - Cancel any action played against you',
    type: CardType.ACTION,
    quantity: 3,
  },
  VASOOLI_BHAI: {
    id: 'VASOOLI_BHAI',
    name: 'Vasooli Bhai',
    description: 'Debt Collector - Force a player to pay ₹5Cr',
    type: CardType.ACTION,
    quantity: 3,
  },
  SHAGUN: {
    id: 'SHAGUN',
    name: 'Shagun',
    description: "It's your birthday - All players pay you ₹2Cr",
    type: CardType.ACTION,
    quantity: 3,
  },
  JUGAAD: {
    id: 'JUGAAD',
    name: 'Jugaad',
    description: 'Sly Deal - Steal a single property from any opponent',
    type: CardType.ACTION,
    quantity: 3,
  },
  ADLA_BADLI: {
    id: 'ADLA_BADLI',
    name: 'Adla Badli',
    description: 'Forced Deal - Swap a property with any opponent',
    type: CardType.ACTION,
    quantity: 3,
  },
  PASS_GO: {
    id: 'PASS_GO',
    name: 'Pass Go',
    description: 'Draw 2 extra cards from the deck',
    type: CardType.ACTION,
    quantity: 10,
  },
};

// Money Card Definitions (in Crores)
export const MoneyCards = [
  { value: 1, quantity: 6 },  // ₹1M
  { value: 2, quantity: 5 },  // ₹2M
  { value: 3, quantity: 3 },  // ₹3M
  { value: 4, quantity: 3 },  // ₹4M
  { value: 5, quantity: 2 },  // ₹5M
  { value: 10, quantity: 1 }, // ₹10M
];

// Helper to check if a property set is complete
export const isSetComplete = (propertiesOfColor, color) => {
  const setSize = PropertySets[color]?.setSize || 0;
  return propertiesOfColor.length >= setSize;
};

// Helper to calculate bank total
export const calculateBankTotal = (bankCards) => {
  return bankCards.reduce((sum, card) => sum + (card.value || 0), 0);
};
