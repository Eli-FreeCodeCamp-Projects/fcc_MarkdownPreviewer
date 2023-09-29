/**
 * React Markdown Preview App
 */
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

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
const mapStateToProps = (state) => {
    return {data: state}
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshPreview: (text) => {
            console.log("Refresh Preview.");
            console.log("Dispatch data length.");
            console.log(text.length);
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