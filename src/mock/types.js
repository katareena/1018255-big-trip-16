import points from './point.js';
const allTypes = points.map((point) => point.type);
export const uniqTypes = Array.from(new Set(allTypes));
