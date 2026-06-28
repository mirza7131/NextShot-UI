import { ValidationErrors } from "@angular/forms";
// import { debug } from "console";

export const getValidatorErrorMessage = (validatorName: string, label: string, validatorErrors?: ValidationErrors): string | string | undefined => {
    let args = messages.get(validatorName)?.validatorErrorsKey?.map(name => validatorErrors?.[name]);
    return (args) ? stringFormat(messages.get(validatorName)?.message, label, ...args) : messages.get(validatorName)?.message;
}

const messages = new Map<string, { message: string, validatorErrorsKey?: string[] }>([
    ['required', { message: 'This field is required' }],
    ['minlength', { message: 'Should be {0} characters long', validatorErrorsKey: ['requiredLength'] }],
    ['maxlength', { message: 'It cannot be more than {0} characters long', validatorErrorsKey: ['requiredLength'] }],
    ['max', { message: 'Should be less then {0}', validatorErrorsKey: ['max'] }],
    ['min', { message: 'Should be greater then 0', validatorErrorsKey: ['requiredLength'] }],
    ['email', { message: 'Invalid Email' }],
    ['pattern', { message: 'Invalid' }],
]);

function stringFormat(template: string | undefined, label: string, ...args: any[]) {
    if (template) {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined'
                ? args[index]
                : match;
        });
    }
    return undefined;
}