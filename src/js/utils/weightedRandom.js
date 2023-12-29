export default function (min, max, weights, noiseFn, params) {
  
    const weightedValues = [];
    let totalWeight = 0;
  
    // Calculate total weight and create weighted values array
    for (let i = min; i <= max; i++) {
      if (weights[i] !== undefined) {
        totalWeight += weights[i];
        weightedValues.push({ value: i, weight: weights[i] });
      }
    }
  
    // Calculate remaining weight to distribute evenly
    const remainingValues = max - min + 1 - weightedValues.length;
    const remainingWeight = 1 - totalWeight;
    const remainingWeightPerValue = remainingWeight / remainingValues;
  
    // Distribute remaining weight evenly among values without assigned weights
    for (let i = min; i <= max; i++) {
      if (!weights[i]) {
        weightedValues.push({ value: i, weight: remainingWeightPerValue });
      }
    }
    // Generate a random number based on weights
    let random = null
    if(noiseFn) {
      random = noiseFn(...params);
    }else{
      random = Math.random();
    }
    let sum = 0;
    for (const { value, weight } of weightedValues) {
      sum += weight;
      if (random < sum) {
        return value;
      }
    }
  
    // Fallback to max value if for some reason it hasn't returned a value yet
    return max;
  }