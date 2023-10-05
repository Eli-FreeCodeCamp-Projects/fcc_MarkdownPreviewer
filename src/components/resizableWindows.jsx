import { useEffect } from 'react'
/**
 * Resizable windows Component
 */
import {ResizableHelper} from "../utils/resizableHelper.js";
import {InputEditor} from './mdEditor.jsx'
import {HtmlPreview} from './mdPreview.jsx'

export function NavBar(props){

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

export function ResizableWindows(props){
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
    useEffect(() => {
        helper.loadView();
        window.addEventListener('resize', handleResizeWindow)
        // returned function will be called on component unmount
        return () => {
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
        helper.handleResizeWindow();
    }

    const handleDragEnd = () => {
        helper.endResize();
        document.ondragover = null;
    }

    const handleDragOver = (e) => {
        if(helper.isOnResize()){
            helper.setMouseLeft(e.pageX);
        }
    }

    const handleExpandWindow = (e) => {
        helper.ExpandWindow(e.target);
    }
    const handleComboView = () => {
        helper.loadComboView();
    }

    const handleResizeWindow = () => {
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

export function ResizableContainer(){
    const leftPane = <InputEditor/>
    const rightPane = <HtmlPreview/>
    return(
        <section className="container-fluid min-vh-100">
            <header><h1>Markdown Previewer</h1></header>
            <ResizableWindows
                leftPane={leftPane}
                rightPane={rightPane}
            />
        </section>
    )
}