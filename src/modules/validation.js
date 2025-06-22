/**
 * Validation Module
 * Provides client-side validation for address inputs.
 */

export class AddressValidator {
    /**
     * Validates an address based on a set of rules.
     * @param {string} address The address string to validate.
     * @returns {{isValid: boolean, errors: Array<{field: string, message: string}>}} A validation result object.
     */
    validate(address) {
        const errors = [];
        const value = address ? address.trim() : '';
        const minLength = 5;
        const maxLength = 200;

        // Rule 1: Required
        if (!value) {
            errors.push({ field: 'address', message: 'Address is required.' });
            return { isValid: false, errors }; // Stop validation if empty
        }

        // Rule 2: Minimum Length
        if (value.length < minLength) {
            errors.push({ field: 'address', message: `Address must be at least ${minLength} characters.` });
        }

        // Rule 3: Maximum Length
        if (value.length > maxLength) {
            errors.push({ field: 'address', message: `Address must be no more than ${maxLength} characters.` });
        }
        
        // Rule 4: Must be in California
        const isCalifornia = /(, CA|, California| 9\d{4})/i.test(value);
        if (!isCalifornia) {
            errors.push({ field: 'address', message: 'Address must be in California.' });
        }

        // Rule 5: Must contain a street address (number and street name)
        const hasNumber = /\d/.test(value);
        const hasStreet = /[a-zA-Z]/.test(value.replace(/(\d|,|CA|California)/ig, '')); // Check for letters besides numbers and state
        if (!hasNumber || !hasStreet) {
            errors.push({ field: 'address', message: 'Please enter a valid street address.' });
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
        };
    }
} 