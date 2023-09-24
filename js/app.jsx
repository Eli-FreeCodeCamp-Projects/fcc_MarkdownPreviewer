/**
 * React Markdown Preview App
 */
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;


/**
 * Output Component
 */
class PreviewOutput extends React.Component {

    constructor(props) {
        super(props);
    }
    render(){
        console.log("Render PreviewOutput Component.");
        console.log("PreviewOutput props : ");
        console.log(this.props);
        return(
            <div id="preview" className={`container-fluid h-100 anim-opacity border border-light rounded`} dangerouslySetInnerHTML={{ __html: this.props.output_text }} />
        )
    }
}

/**
 * Editor Component
 */
class PreviewEditor extends React.Component {

    constructor(props) {
        super(props);
        this.set_default_input = this.set_default_input.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    set_default_input(){
        let default_text = '# Title 1\n\r';
        default_text += 'Some text with inline code ``<div</div>``.\r';
        default_text += '## Title 2   \r';
        default_text += '[Github acount](https://github.com/mano8)\r';
        default_text += 'Here is a code block example:\r';
        default_text += '```\r';
        default_text += '<h1>Title 1</h1> \r';
        default_text += '<h2>Title 2</h2> \r';
        default_text += '```\r';
        default_text += 'Here is a list example:\r';
        default_text += ' - Item 1\r';
        default_text += ' - Item 2\r';
        default_text += ' - Item 3\r';
        default_text += ' - Item 4\r';
        default_text += '  \r';
        default_text += 'Here is a blockquote example:\r';
        default_text += '> Hello World !!!\r';
        default_text += 'You can also make text **bold**... whoa!\r';
        default_text += 'Or _italic_.\r';
        default_text += 'Or... wait for it... **_both!_**\r';
        default_text += '\r\r';
        default_text += '![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\r';
        this.props.refreshPreview(default_text);
        return default_text;
    }
    handleChange(e){
        const value = e.target.value;
        this.props.refreshPreview(value)
    }

    render(){
        console.log("Render PreviewEditor Component.");
        console.log("PreviewEditor props : ");
        console.log(this.props);



        return(
            <div className={`container-fluid h-100`}>
                <textarea id="editor" name="editor" className="form-control text-bg-dark h-100" onChange={this.handleChange} >
                    {(this.props.input_text) ? this.props.input_text : this.set_default_input()}
                </textarea>
            </div>
        )
    }
}


/**
 * Previewer Component
 */
class Previewer extends React.Component {

    constructor(props) {
        super(props);
        this.btn_top = 0;
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDrag = this.handleDrag.bind(this)

    }
    handleDragStart(e){
        console.log(`Drag Start :->`);
        this.btn_top = e.target.offsetTop;
    }

    handleDrag(e){
        e.preventDefault()
        const line = e.target.parentElement;
        const editor = line.parentElement.firstChild;
        const previewer = line.parentElement.lastChild;
        const mouse_x = e.pageX;
        const w_editor = mouse_x - editor.offsetLeft;
        const w_previewer = (previewer.offsetLeft + previewer.offsetWidth) - mouse_x;
        if(mouse_x > 100 &&  mouse_x < window.innerWidth - 100 ){
            editor.style.width = `${w_editor}px`;
            if(this.btn_top > 0) {
                console.log(`fixed button height :-> ${this.btn_top} -- target: ${e.target}`);
                console.log(e.target);
                e.target.top = this.btn_top
            }
            previewer.style.width = `${w_previewer}px`;
            line.style.left = `${mouse_x}px`;
            console.log(`Drag :-> mouse_x: ${mouse_x} -- w_editor: ${w_editor} -- w_previewer: ${w_previewer} -- e:`);
            console.log(e);
        }


    }
    handleDragEnd(e){
        console.log(`Drag End :->`);
    }

    render(){
        console.log("Render Previewer Component.");
        console.log("Previewer props : ");
        console.log(this.props);

        return(
            <div id="previewer" className={`d-flex justify-content-between overflow-hidden`}>
                <div className="p-1 editor-container">
                    <div className="card text-bg-dark h-100 border-light">
                        <div className="card-header border-light">Markdown Editor</div>
                        <div className="card-body">
                            <PreviewEditor input_text={this.props.input_text} refreshPreview={this.props.refreshPreview} />
                        </div>
                    </div>
                </div>
                <div className="size-container">
                    <button type="button" className="btn btn-light" onDragStart={this.handleDragStart} onDrag={this.handleDrag} onDragEnd={this.handleDragEnd} draggable>
                        <i className="fas fa-arrows-alt-h"></i>
                    </button>
                </div>
                <div className="p-1  preview-container">
                    <div className="card text-bg-dark border-light">
                        <div className="card-header border-light">Html Preview</div>
                        <div className="card-body">
                            <PreviewOutput output_text={this.props.output_text}  />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * Error Box Message
 */
class ErrorBox extends React.Component {

    constructor(props) {
        super(props);
    }
    render(){
        console.log("Render ErrorBox Component.");
        console.log("ErrorBox props : ");
        console.log(this.props);
        return(
            <div className={`wrapper box-error`}>
                <div className="error-header">
                    <h1>Error :</h1>
                </div>
                <div className="error-message">
                    {this.props.error_msg}
                </div>
            </div>
        )
    }
}

/**
 * Main Root component
 **/
class Root extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        console.log("Render Root Component.");
        console.log("Root props : ");
        console.log(this.props);
        if(this.props.data){
            if(this.props.data.status === false){
                return(
                    <section className={`container-fluid`}>
                        <ErrorBox error_msg={this.props.data.data.error_msg} />
                    </section>
                )
            }else{
                return(
                    <section className="container-fluid min-vh-100">
                        <Previewer
                            input_text={this.props.data.input_text}
                            output_text={this.props.data.output_text}
                            refreshPreview={this.props.refreshPreview} />
                    </section>
                )
            }

        }
        else{
            console.log("Render Root Component and wait for quotes data.");
        }
    }
}

// React-Redux
const mapStateToProps = (state) => {
    return {data: state}
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshPreview: (text) => {
            console.log("Refresh Preview.");
            console.log("Dispatch data.");
            console.log(text);
            dispatch(refreshPreview(text));
        }
    }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Root);

class AppWrapper extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Container/>
            </Provider>
        );
    }
}


ReactDOM.render(<AppWrapper />, document.getElementById('main-app'));