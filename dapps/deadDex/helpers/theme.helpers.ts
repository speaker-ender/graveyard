
export const lightOrDark = (color: string) => {

    // Variables for red, green, blue values
    let r: number;
    let g: number;
    let b: number;
    let hsp: number;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        const colorMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = colorMatch ? parseInt(colorMatch[1]) : 0;
        g = colorMatch ? parseInt(colorMatch[2]) : 0;
        b = colorMatch ? parseInt(colorMatch[3]) : 0;
    }
    else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        const colorMatch = +("0x" + color.slice(1).replace(
            (color.length < 5) ? /./g : '', '$&$&')
        );

        r = colorMatch >> 16;
        g = colorMatch >> 8 & 255;
        b = colorMatch & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return 'light';
    }
    else {

        return 'dark';
    }
}