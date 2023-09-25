/**
 * Helper functions
 */
const debug = true;

/**
 * Sanitize html string with DOMPurify.js package.
 *
 * @param text string to Sanitize
 *
 * @return string Return Sanitized Html string.
 */
const sanitize_md = (text) => {
    return DOMPurify.sanitize(
        text, {USE_PROFILES: {html: true}, ADD_ATTR: ['target'] }
    )
}

/**
 * Parse Markdown to Html with marked.js package
 * @param text string Markdown value to parse
 *
 * @return string Return parsed html string.
 */
const parse_markdown = (text) => {
    const link_extension = {
        name: 'link',
        renderer(token) {
            return `<a target="_blank" href="${token.href}">${token.text}</a>`;
        }
    }

    marked.use({
        gfm: true,
        breaks: true,
        extensions: [
            link_extension
        ]
    });
    return marked.parse(text)
}

/**
 * Resize element width, and set visibility to hidden if width value is <= to zero.
 * @param element
 * @param newWidth
 */
const resizePane = (element, newWidth) => {
    if(newWidth > 0){
        element.style.visibility = `visible`;
        element.style.width = `${newWidth}px`;
    }else{
        element.style.visibility = `hidden`;
    }
}

/**
 * Helper Utilities
 * @type {{isObject: (function(*): *), isNumber: (function(*): *), isPositiveNumber: (function(*): *), isArray: (function(*): arg is any[]), isStr: (function(*): *)}}
 */
const ut = {
    isObject: (value) => {
        return typeof value === 'object' && !Array.isArray(value) && value !== null
    },
    isArray: (value) => {
        return Array.isArray(value)
    },
    isNumber:(value) => {
        return !isNaN(value) && value != null
    },
    isPositiveNumber: (value) => {
        return this.isNumber(value) && value > 0
    },
    isStr: (value) => {
        return (typeof value === 'string' || value instanceof String)
    }
}


const defaultInput = "# Title 1\n" +
    "\n" +
    "Some text with inline code ``<div</div>``.\n" +
    "## Title 2   \n" +
    "[Github acount](https://github.com/mano8)\n" +
    "Here is a code block example:\n" +
    "```\n" +
    "<h1>Title 1</h1> \n" +
    "<h2>Title 2</h2> \n" +
    "```\n" +
    "Here is a list example:\n" +
    " - Item 1\n" +
    " - Item 2\n" +
    " - Item 3\n" +
    " - Item 4\n" +
    "  \n" +
    "Here is a blockquote example:\n" +
    "> Hello World !!!\n" +
    "You can also make text **bold**... whoa!\n" +
    "Or _italic_.\n" +
    "Or... wait for it... **_both!_**\n" +
    "\n" +
    "\n" +
    "![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\n";