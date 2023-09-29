/**
 * Redux Store
 * Use redux.js, purify.js, marked.js
 */

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
            const output_value = parse_markdown(data)
            dispatch(
                refresh(
                    {input_text: data, output_text: output_value}
                )
            );
        }
        catch (e) {
            if(debug) {
                console.log("Fatal Error: Unable to Refresh Preview");
                console.log(e);
            }
            dispatch(dataError("Sorry we are unable to preview markdown, check your code please."))
        }
    }

};


/**
 * Default state values.
 **/
const defaultState = {
    status: true,
    error_msg: '',
    min_resize_width: 768,
    input_text: defaultInput,
    output_text: parse_markdown(defaultInput)
};

/**
 * Redux Reducer
 **/
const DataReducer = (state = defaultState, action) => {
    switch(action.type) {
        case REFRESH:
            if(debug) { console.log("REFRESH Preview action from Reducer."); }
            return {
                status: true,
                error_msg: '',
                min_resize_width: state.min_resize_width,
                input_text: action.input_text,
                output_text: action.output_text
            };
        case DATA_ERROR:
            if(debug) { console.log("DATA_ERROR Quote action from Reducer."); }
            return {
                status: true,
                error_msg: '',
                min_resize_width: state.min_resize_width,
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