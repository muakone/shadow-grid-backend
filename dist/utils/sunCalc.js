"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrientationFactor = getOrientationFactor;
function getOrientationFactor(orientation) {
    switch (orientation) {
        case "South": return 1;
        case "East": return 0.8;
        case "West": return 0.75;
        case "North": return 0.5;
        default: return 0.6;
    }
}
