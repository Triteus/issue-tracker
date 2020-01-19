"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validators/validate");
const error_1 = require("./error");
/**
 * @param validators object that includes validators for each route/method of the controller
 * @return function that takes name of route/method and returns fitting validation-middlewares
 */
function validation(validators) {
    return function (name) {
        if (!validators[name]) {
            throw new error_1.ValMethodError(`Validators for method ${name} not found!`, name);
        }
        return [validators[name], validate_1.validate];
    };
}
exports.validation = validation;
//# sourceMappingURL=validation.js.map