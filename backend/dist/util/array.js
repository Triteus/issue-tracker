"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayEquals(array1, array2) {
    return array1.length === array2.length && array1.sort().every(function (value, index) { return value === array2.sort()[index]; });
}
exports.arrayEquals = arrayEquals;
//# sourceMappingURL=array.js.map