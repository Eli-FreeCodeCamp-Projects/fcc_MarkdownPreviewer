/**
 * React Markdown Preview App
 */
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;


/**
 * Output Component
 */
function HtmlPreview({output_text}){
    if(debug) {
        console.log("Render HtmlPreview Component.")
    }

    return(
        <div
            id="preview"
            className={`container-fluid h-100`}
            dangerouslySetInnerHTML={{ __html: output_text }}
        />
    )
}

/**
 * Editor Component
 */
function InputEditor({refreshPreview}){
    if(debug) {
        console.log("Render InputEditor Component.")
    }

    React.useEffect(() => {
        if(debug) {
            console.log(`Mount InputEditor Component :------------->`);
        }
        const element = document.getElementById('editor');
        if(!element.value){
            element.value = defaultInput;
        }
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        refreshPreview(value)
    }

    return(
        <div className={`container-fluid p-0`}>
            <div className="form-floating">
                    <textarea
                        id="editor"
                        name="editor"
                        className="form-control text-bg-dark h-100 border-0"
                        onChange={handleChange}>

                    </textarea>
                <label htmlFor="editor">Type your Markdown</label>

            </div>
        </div>
    )
}

function NavBar(props){

    return (
        <nav id="m8-nav-resizable" className="navbar navbar-expand-lg text-bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand  text-light" href="#">Navbar</a>
                <ul className="nav justify-content-end">
                    <li className="nav-item px-1 left-expand">
                        <button
                            id="m8-left-expand"
                            className="btn btn-outline-light border-0"
                            type="button"
                            aria-expanded="false"
                            aria-controls="m8_left_body"
                            onClick={props.handleExpandWindow}
                        >
                            <i className="fas fa-code"></i>
                        </button>
                    </li>
                    <li className="nav-item px-1 combo-expand">
                        <button
                            id="m8-expand-combo"
                            className="btn btn-outline-light border-0 active"
                            type="button"
                            aria-expanded="false"
                            onClick={props.handleComboView}
                        >
                            <i className="fas fa-columns"></i>
                        </button>
                    </li>
                    <li className="nav-item px-1 right-expand">
                        <button
                            id="m8-right-expand"
                            className="btn btn-outline-light border-0"
                            type="button"
                            aria-expanded="false"
                            aria-controls="m8_right_body"
                            onClick={props.handleExpandWindow}
                        >
                            <i className="fas fa-file-image"></i>
                        </button>
                    </li>
                </ul>

            </div>
        </nav>
    )
}

/**
 * ResizableWindows Component.
 *
 */
function ResizableWindows(props){
    if(debug) {
        console.log("Render ResizableWindows Component.")
        console.log(props);
    }
    /**
     * Instantiate PreviewerHelper class.
     * Used to collapse and resize Previewer Component windows
     * @type {ResizableHelper}
     */
    const helper = new ResizableHelper({
        window: {
            // minWidth value must be the same as css media min-width
            minWidth: 768
        },
        nav:{
            btLeft: '#m8-left-expand',
            btCombo: '#m8-expand-combo',
            btRight: '#m8-right-expand'
        },
        leftPane:{
            selector: '#previewer .editor-container',
            minWidth: 300,
        },
        rightPane:{
            selector: '#previewer .preview-container',
            minWidth: 300,
        },
        resizeBar:{
            selector: '#previewer .preview-container'
        }

    })

    /**
     * Mount and Unmount component hook
     * componentWillUnmount is simulated by returning a function inside the useEffect hook.
     */
    React.useEffect(() => {
        if(debug) {
            console.log(`Mount ResizableWindows Component :------------->`);
        }
        helper.loadView();
        window.addEventListener('resize', handleResizeWindow)
        // returned function will be called on component unmount
        return () => {
            if(debug) {
                console.log(`UnMount ResizableWindows Component :------------->`);
            }
            window.removeEventListener('resize', handleResizeWindow)
        }
    }, []);

    /**
     * handleDragStart
     * @param e The react event handler
     */
    const handleDragStart = (e) => {
        // init drag event for firefox
        // see :
        //  - https://bugzilla.mozilla.org/show_bug.cgi?id=568313
        //  - https://bugzilla.mozilla.org/show_bug.cgi?id=646823#c4
        if(debug) {
            console.log(`handleDragStart :->`);
        }
        helper.startResize()
        e.dataTransfer.effectAllowed = 'none';
        // set invisible element to ghost drag image to hidden ghost image
        e.dataTransfer.setDragImage(e.target.lastChild, 0, 0);
        // handle dragover to get mouse position (firefox need it)
        // see: https://stackoverflow.com/questions/5798167/getting-mouse-position-while-dragging-js-html5
        document.ondragover = handleDragOver;
        /*window.addEventListener('ondragover', this.handleMouseMove, true);
        window.dispatchEvent()*/
    }

    /**
     * handleDrag
     * Update width values of left and right pane,
     * and update left position of resizer bar.
     */
    const handleDrag = () => {
        if(debug) {
            console.log(`handleDrag :->`);
        }
        helper.handleResizeWindow();
    }

    const handleDragEnd = () => {
        if(debug) {
            console.log(`handleDragEnd :->`);
        }
        helper.endResize();

        document.ondragover = null;
    }

    const handleDragOver = (e) => {
        if(helper.isOnResize()){
            //console.log(`handleMouseMove :-> resizeStarted`);
            helper.setMouseLeft(e.pageX);
        }
    }

    const handleExpandWindow = (e) => {
        if(debug) {
            console.log(`handleExpandWindow ------------------------------------------->`);
        }
        helper.ExpandWindow(e.target);
    }
    const handleComboView = () => {
        if(debug) {
            console.log(`handleComboView ------------------------------------------->`);
        }
        helper.loadComboView();
    }

    const handleResizeWindow = () => {
        if(debug) {
            console.log(`handleResizeWindow ------------------------------------------->`);
        }
        helper.resizeView()
    }

    return (
        <div className="resizable">
            <NavBar handleExpandWindow={handleExpandWindow} handleComboView={handleComboView} />
            <div id="previewer"
                 className={`d-flex flex-column flex-md-row justify-content-md-between min-vh-100`}
            >
                <div id="m8-editor-container" className="editor-container" style={helper.getLeftPaneStyle()}>
                    <div className="card text-bg-dark border-light">
                        <div className="card-header border-light p-0">
                            <h2 className="d-flex flex-row align-items-center"></h2>
                            <button
                                type="button"
                                className="btn btn-outline-light border-0 btn-sm w-100 d-flex flex-row justify-content-between px-3 m8-collapse"
                                aria-expanded="false"
                                aria-controls="m8_left_body"
                                onClick={handleExpandWindow}
                            >
                                Editor <i className="fas fa-chevron-down d-flex flex-row align-items-center"></i>
                            </button>
                        </div>
                        <div id="m8_left_body" className="card-body">
                            {props.leftPane}
                        </div>
                    </div>
                </div>
                <div
                    id="m8-size-container"
                    className="size-container"
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    draggable="true"
                    style={helper.getResizeBarStyle()}>
                    <button type="button" className="btn btn-light">
                        <i className="fas fa-arrows-alt-h"></i>
                    </button>
                    <div className="ghost-drag"></div>
                </div>
                <div id="m8-preview-container" className="preview-container" style={helper.getRightPaneStyle()}>
                    <div className="card text-bg-dark h-100 border-light">
                        <div className="card-header border-light p-0">
                            <h2 className="d-flex flex-row align-items-center"></h2>
                            <button
                                type="button"
                                className="btn btn-outline-light border-0 btn-sm w-100 d-flex flex-row justify-content-between px-3 m8-collapse"
                                aria-expanded="false"
                                aria-controls="m8_right_body"
                                onClick={handleExpandWindow}
                            >
                                Html Preview <i className="fas fa-chevron-down d-flex flex-row align-items-center"></i>
                            </button>
                        </div>
                        <div id="m8_right_body" className="card-body">
                            {props.rightPane}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

function ResizableContainer(){
    if(debug) {
        console.log("Render ResizableContainer Component.");
    }
    return(
        <section className="container-fluid min-vh-100">
            <header><h1>Markdown Previewer</h1></header>
            <ResizableWindows
                leftPane=<EditorContainer />
                rightPane=<PreviewContainer />
            />
        </section>
    )
}

/**
 * Main Root component
 **/
class Root extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        if(debug){
            console.log("Render Root Component.");
            console.log("Root props : ");
            console.log(this.props);
        }

        return(
            <ResizableContainer {...this.props} />
        )
    }
}

// React-Redux

const mapDispatchToProps = (dispatch) => {
    return {
        refreshPreview: (text) => {
            if(debug){
                console.log("Refresh Preview.");
                console.log("Dispatch data length.");
                console.log(text.length);
            }

            dispatch(refreshPreview(text));
        }
    }
};

const mapStateToPropsRoot = (state) => {
    return {
        input_text: state.input_text,
        output_text: state.output_text
    }
};

const mapStateToPropsPreview = (state) => {
    return {
        output_text: state.output_text,
        input_text: state.input_text
    }
};



/*
const EditorContainer = (props) => {
    <InputEditor {...props} />
}

const PreviewContainer = (props) => {
    <HtmlPreview {...props} />
}*/

const EditorContainer = connect(null, mapDispatchToProps)(InputEditor);
const PreviewContainer = connect(mapStateToPropsPreview, null)(HtmlPreview);
const RootContainer = connect(mapStateToPropsRoot, null)(Root);


class AppWrapper extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Root/>
            </Provider>
        );
    }
}


ReactDOM.render(<AppWrapper />, document.getElementById('main-app'));