/**
 * checks if the given string is a valid alpha numeric value. It also allows spaces.
 * @param {String} str
 */
export const isValidAlphaNumericString = (str) =>
    str !== "" && str.match(/^[a-zA-Z0-9 ]*$/);
