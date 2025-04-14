
// Utility for analyzing retina images

// Generate a simulated analysis from a canvas image data
export const analyzeRetinaImage = (imageData: string): {
  patterns: number[];
  signaturePoints: {x: number, y: number, intensity: number}[];
  id: string;
} => {
  // In a real application, this would perform actual retina analysis
  // For demo purposes, we're generating random data that would represent 
  // various aspects of retina scanning

  // Generate unique patterns (would be actual image processing in real app)
  const patterns = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
  
  // Generate signature points (would be blood vessel intersections in real app)
  const signaturePoints = Array.from({ length: 15 }, () => ({
    x: Math.random(),
    y: Math.random(),
    intensity: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
  }));

  // Generate a unique ID based on the pattern
  const id = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return {
    patterns,
    signaturePoints,
    id
  };
};

// Compare two retina patterns and calculate a match score
export const compareRetina = (
  stored: { patterns: number[]; signaturePoints: {x: number, y: number, intensity: number}[] },
  current: { patterns: number[]; signaturePoints: {x: number, y: number, intensity: number}[] }
): number => {
  // In a real app, this would use complex matching algorithms
  // For demo purposes, we'll simulate a matching score
  
  // Pattern similarity (simulated)
  const patternSimilarity = Math.random() * 30 + 70; // 70-100% similarity
  
  // Point similarity (simulated)
  const pointSimilarity = Math.random() * 30 + 70; // 70-100% similarity
  
  // Combined score (0-100)
  return (patternSimilarity * 0.6) + (pointSimilarity * 0.4);
};

// Generate demo graph data for visualization
export const generateGraphData = (patterns: number[]): any[] => {
  return patterns.map((value, index) => ({
    name: `P${index + 1}`,
    value
  }));
};
