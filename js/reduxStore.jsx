/**
 * Redux Store
 * Use redux.js, purify.js, marked.js
 */
const sanitize_md = (text) => {
    return DOMPurify.sanitize(
        text, {USE_PROFILES: {html: true}, ADD_ATTR: ['target'] }
    )
}

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

//-> Actions constant
const REFRESH = 'REFRESH',
    DATA_ERROR = 'DATA_ERROR';
//-> Actions Creator
const refresh = (data) => { return {type: REFRESH, input_text: data.input_text, output_text: data.output_text} };
const dataError = (error) => { return {type: DATA_ERROR, error: error} };

/**
 * Refresh output preview.
 **/
const refreshPreview = (data) => {
    return function(dispatch){
        try {
            const output_value = sanitize_md(
                parse_markdown(data)
            )
            dispatch(
                refresh(
                    {input_text: data, output_text: output_value}
                )
            );
        }
        catch (e) {
            console.log("Fatal Error: Unable to Refresh Preview");
            console.log(e);
            store.dispatch(dataError("Sorry we are unable to preview markdown, check your code please."))
        }
    }

};


/**
 * Default state values.
 **/
const defaultState = {
    status: true,
    error_msg: '',
    input_text: '',
    output_text: ''
};

/**
 * Redux Reducer
 **/
const DataReducer = (state = defaultState, action) => {
    switch(action.type) {
        case REFRESH:
            console.log("REFRESH Preview action.");
            console.log("Actual input md : ")
            console.log(action.data)
            return {
                status: true,
                error_msg: '',
                input_text: action.input_text,
                output_text: action.output_text
            };
        case DATA_ERROR:
            console.log("DATA_ERROR Quote action.");
            return {
                status: true,
                error_msg: '',
                input_text: '',
                output_text: ''
            };
        default:
            return state;
    }
};

const store = Redux.createStore(
    DataReducer,
    Redux.applyMiddleware(ReduxThunk)
);