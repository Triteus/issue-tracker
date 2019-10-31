import { validate } from "../validators/validate";
import { ValMethodError } from "./error";

/**
 * @param validators object that includes validators for each route/method of the controller
 * @return function that takes name of route/method and returns fitting validation-middlewares
 */

export function validation(validators: Object) {
    return function (name: string): any[] {
        if (!validators[name]) {
            throw new ValMethodError(`Validators for method ${name} not found!`, name);
        }
        return [validators[name], validate];
    }
}