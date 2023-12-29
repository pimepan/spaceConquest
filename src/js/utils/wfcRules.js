export default {
  options: {
    collapseType: "normal", //default 'normal'
    saveInterval: 0.02, // Default 0.02
    baseWeight: 10, // Default 10
  },
  tiles: [
    // Grass
    { edges: ['AAA', 'AAA', 'AAA', 'AAA'], type: 'grass', exceptions: undefined, weight: 15 },
    
    // Shoreline water beneath
    { edges: ['BBC', 'BBC', 'BBC', 'BBC'], type: 'shoreline_beneath', exceptions: undefined, weight: 10 },
    
    // Shoreline water to the right and beneath
    { edges: ['CBA', 'CBA', 'CBA', 'CBA'], type: 'shoreline_right_beneath', exceptions: undefined, weight: 10 },
    
    // Shoreline water to the left and beneath
    { edges: ['ABC', 'ABC', 'ABC', 'ABC'], type: 'shoreline_left_beneath', exceptions: undefined, weight: 10 },
    
    // Shoreline water to the right and above
    { edges: ['ACB', 'ACB', 'ACB', 'ACB'], type: 'shoreline_right_above', exceptions: undefined, weight: 10 },
    
    // Shoreline water to the left and above
    { edges: ['BCA', 'BCA', 'BCA', 'BCA'], type: 'shoreline_left_above', exceptions: undefined, weight: 10 },
    
    // Water
    { edges: ['BBB', 'BBB', 'BBB', 'BBB'], type: 'water', exceptions: undefined, weight: 15 },
  ],
};
