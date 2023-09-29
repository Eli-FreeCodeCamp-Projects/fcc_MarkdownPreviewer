
/**
 * Output Component
 */
function HtmlPreview({output_text}){
    if(debug) {
        console.log("Render HtmlPreview Component.")
    }
    React.useEffect(() => {
        document.output_text = output_text
    }, [output_text]);
    return(
        <div
            id="preview"
            className={`container-fluid h-100`}
            dangerouslySetInnerHTML={{ __html: output_text }}
            /*onCompositionEnd={this.handleOnchange}
            onMouseOut={this.handleOnMouseOut}*/
        />
    )
}

/**
 * Editor Component
 */
function InputEditor({input_text, refreshPreview}){
    if(debug) {
        console.log("Render InputEditor Component.")
    }
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
                        onChange={handleChange}
                        value={input_text}>

                    </textarea>
                <label htmlFor="editor">Type your Markdown</label>

            </div>
        </div>
    )
}


function NavBar(props){

    return (
        <nav className="navbar navbar-expand-lg text-bg-dark nav-resizable">
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
 * ToDo:
 *  - In desktop version:
 *    -
 *  - In mobile version:
 *    -
 *  - In both:
 *    - if resize and load stored sizes need to adapt at screen size with same proportions
 *  - All react component are rendered on change props -> very bad
 *  - remove all console logs and debug
 *  - redux must be connected directly to child's ????
 */
function ResizableWindows(props){
    if(debug) {
        console.log("Render ResizableWindows Component.")
        console.log(props);
    }

    /**
     * Instantiate PreviewerHelper class.
     * Used to collapse and resize Previewer Component windows
     * @type {PreviewerHelper}
     */
    const helper = new PreviewerHelper({
        window: {
            // minWidth value must be the same as css media min-width
            minWidth: 768
        },
        editor: {
            selector: '#previewer .editor-container',
            minWidth: 300,
        },
        preview: {
            selector: '#previewer .preview-container',
            minWidth: 300,
        },
        resizeBar: {
            selector: '#previewer .preview-container'
        }
    });

    /**
     * Mount and Unmount component hook
     * componentWillUnmount is simulated by returning a function inside the useEffect hook.
     */
    React.useEffect(() => {
        if(debug) {
            console.log(`Mount ResizableWindows Component :------------->`);
        }
        helper.getDataFromStorage();
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
     * @param e The react event handler
     */
    const handleDrag = (e) => {
        if(debug) {
            console.log(`handleDrag :->`);
        }
        helper.resizeWindows();
    }

    const handleDragEnd = (e) => {
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
    const handleComboView = (e) => {
        if(debug) {
            console.log(`handleComboView ------------------------------------------->`);
        }
        helper.loadComboView();
    }

    const handleResizeWindow = (e) => {
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
                <div id="m8-editor-container" className="editor-container" style={helper.getEditorStyle()}>
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
                <div id="m8-preview-container" className="preview-container" style={helper.getPreviewStyle()}>
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

function ResizableContainer(props){
    if(debug) {
        console.log("Render ResizableContainer Component.");
    }
    const mounted = React.useRef();
    React.useEffect(() => {
        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;
            if(debug) {
                console.log("componentDidMount");
                console.log(mounted)
            }
        } else {
            // do componentDidUpdate logic
            if(debug) {
                console.log("componentDidUpdate");
            }
            return false;
        }
    }, [props.data.min_resize_width]);
    return(
        <section className="container-fluid min-vh-100">
            <header><h1>Markdown Previewer</h1></header>
            <ResizableWindows
                min_resize_width={props.data.min_resize_width}
                leftPane=<InputEditor input_text={props.data.input_text} refreshPreview={props.refreshPreview} />
            rightPane=<HtmlPreview output_text={props.data.output_text}  />
            />
        </section>
    )
}