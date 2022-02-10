
export const removeParenthesisWithText = (text: string) => text.replace(/ *\([^)]*\) */g, "");

export const camelCaseToUpperCase = (text: string) => text.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
