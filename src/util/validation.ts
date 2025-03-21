export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
}

export function validate(validatableInput: Validatable): boolean {
    let isValid = true;
    if (validatableInput.required)
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    if (validatableInput.minLength !== undefined && typeof validatableInput.value === "string")
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    if (validatableInput.maxLength !== undefined && typeof validatableInput.value === "string")
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    if (validatableInput.minValue !== undefined && typeof validatableInput.value === "number")
        isValid = isValid && validatableInput.value >= validatableInput.minValue;
    if (validatableInput.maxValue !== undefined && typeof validatableInput.value === "number")
        isValid = isValid && validatableInput.value <= validatableInput.maxValue;
    return isValid;
}
