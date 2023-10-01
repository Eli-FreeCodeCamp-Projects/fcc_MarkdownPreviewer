/**
 * Helper functions
 */
const debug = false,
    defaultInput = "# Title 1\n" +
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

/**
 * Data Storage Helper class
 * Used to load and save data from localStorage and/or sessionStorage
 * Contain only static methods and properties.
 */
class DataStorage{
    static SESSION_STORAGE = "SESSION_STORAGE"
    static LOCAL_STORAGE = "LOCAL_STORAGE"

    /**
     * Test if is valid data storage key
     * @param key The data storage key to test
     * @return {Error|boolean}
     */
    static isStoreKey(key){
        if(! ut.isAttrKey(key)){
            return new Error(`Unable to get store data. Data key is invalid.`)
        }
        return true;
    }

    /**
     * Select data storage to use.
     * Can be sessionStorage or localStorage
     * @param storage the storage name to use.
     * @return {Error|any}
     */
    static getStore(storage){
        switch(storage){
            case DataStorage.SESSION_STORAGE:
                return sessionStorage;
            case DataStorage.LOCAL_STORAGE:
                return localStorage;
            default:
                return new Error(`Invalid Storage type. Can be SESSION_STORAGE or LOCAL_STORAGE`);
        }
    }

    /**
     * Get Data from selected storage (localStorage or sessionStorage).
     * By default, get data from localStorage.
     * @param key The data storage key
     * @param storage The storage to use (localStorage or sessionStorage)
     * @return {*|null}
     */
    static getStoreData(key, storage= DataStorage.LOCAL_STORAGE){
        DataStorage.isStoreKey(key);
        const store = DataStorage.getStore(storage);
        let storageData = store.getItem("m8Prv_sizes");
        if(ut.isStr(storageData)){
            storageData = JSON.parse(storageData);
        }
        return (ut.isObject(storageData)) ? storageData : null;
    }

    /**
     * Save Data on selected storage (localStorage or sessionStorage)
     * @param key {String} The data storage key
     * @param data {Object} The data to store
     * @param storage {String} The storage to use (localStorage or sessionStorage)
     * @return {Error|boolean} Return true or Error if data is not a valid Object.
     */
    static setStoreData(key, data, storage= DataStorage.LOCAL_STORAGE) {
        DataStorage.isStoreKey(key);
        const store = DataStorage.getStore(storage);
        if(!ut.isObject(data)){
            return new Error(`Unable to set storage data. Data must be a valid object.`)
        }
        store.setItem("m8Prv_sizes", JSON.stringify(data));
        return true;
    }
}

/**
 *
 */
class ResizableBase{

    COMBO_PANE = 'COMBO_PANE'
    LEFT_PANE = 'LEFT_PANE'
    RIGHT_PANE = 'RIGHT_PANE'

    /**
     *
     * @param selector
     * @param defaultValue
     * @return {*|null}
     */
    static setSelector(selector, defaultValue= null){
        const def = (ut.isSelector(defaultValue)) ? defaultValue : null;
        return (ut.isSelector(selector)) ? selector : def;
    }

    /**
     *
     * @param value
     * @return {*|boolean}
     */
    static isDimValue(value){
        return ut.isNumber(value) && value >= 0;
    }

    /**
     *
     * @param value
     * @param defaultValue
     * @return {*|null}
     */
    static setDimValue(value, defaultValue= null){
        const def = (ResizableBase.isDimValue(defaultValue)) ? defaultValue : null;
        return (ResizableBase.isDimValue(value)) ? value : def;
    }

    /**
     *
     * @param selector
     * @return {number|null}
     */
    getOffsetWith(selector){
        const element = document.querySelector(selector)
        return (ut.isElement(element)) ? element.offsetWidth : null;
    }

    /**
     *
     * @param selector
     * @return {number|null}
     */
    getOffsetLeft(selector){
        const element = document.querySelector(selector)
        return (ut.isElement(element)) ? element.offsetLeft : null;
    }
}
/**
 * SidePane class
 */
class SidePane extends ResizableBase{
    constructor(props){
        super();
        this.selector = null;
        this.width = null;
        this.minWidth = 300;
        this.setProps(props);
    }

    /**
     *
     * @param props
     */
    setProps(props){
        if(ut.isObject(props)){
            this.setSelector(props.selector)
            this.setMinWidth(props.minWidth);
        }
    }

    /**
     *
     * @return {boolean|*}
     */
    isReady(){
        return ut.isSelector(this.selector)
    }

    /**
     *
     * @param value
     */
    setMinWidth(value){
        this.minWidth = SidePane.setDimValue(value, 300);
    }

    /**
     *
     * @param value
     */
    setSelector(value){
        this.selector = SidePane.setSelector(value);
    }

    getElement(){
        return document.querySelector(this.selector);
    }

    /**
     *
     * @param width
     * @return {{visibility: string, width: string}|{visibility: string}|null}
     */
    static getPaneStyle(width){
        if(ut.isPositiveNumber(width)){
            return {
                width: `${width}%`,
                visibility: 'visible'
            }
        }else if(ut.isNumber(width) && width === 0){
            return {
                visibility: 'hidden'
            }
        }else{
            return null;
        }

    }

    /**
     *
     * @param width
     * @return {*|boolean}
     */
    static isWidth(width){
        return SidePane.isDimValue(width);
    }

    /**
     *
     * @param width
     * @return {boolean}
     */
    setWidth(width){
        if(SidePane.isWidth(width)){
            this.width = width
            return true;
        }
        return false;
    }

    /**
     *
     * @return {{visibility: string, width: string}|{visibility: string}}
     */
    getStyle(){
        return SidePane.getPaneStyle(this.width);
    }

    /**
     *
     * @return {null}
     */
    resizePane(width){
        const element = this.getElement();
        if(ut.isPositiveNumber(width)){
            element.style.visibility = '';
            element.style.width = `${width}%`;
        }else{
            element.style.width = `${0}`;
            element.style.visibility = `hidden`;
        }
    }

    /**
     *
     */
    resetStyle(){
        const element = this.getElement()
        element.style.width = '';
        element.style.visibility = '';
        element.style.height = '';
        element.style.display = '';
    }
}

/**
 *
 */
class ResizeBar extends ResizableBase{
    constructor(props){
        super()
        this.selector = null;
        this.left = null;

        this.setProps(props);
    }

    setSelector(value){
        this.selector = ResizeBar.setSelector(value);
    }

    getElement(){
        return document.querySelector(this.selector);
    }

    setProps(props){
        if(ut.isObject(props)){
            this.setSelector(props.selector);
        }
    }

    isReady(){
        return ut.isSelector(this.selector)
    }

    isLeftValue(left){
        return ResizeBar.isDimValue(left);
    }
    setLeft(left){
        if(ut.isNumber(left)){
            this.left = left;
            return true;
        }
        return false;
    }

    getStyle(){
        if(this.isLeftValue(this.left)){
            return {
                left: `${this.left}px`
            };
        }
        return null;
    }

    setLeftPosition(){
        if(this.isLeftValue(this.left)){
            const element = this.getElement()
            element.style.left = `${this.left}px`;
            return true;
        }
        return null;
    }

    resetStyle(){
        document.querySelector(this.selector).style.left = '';
    }
}

/**
 *
 */
class PreviewerNav extends ResizableBase{

    constructor(props){
        super();
        this.btLeft = null;
        this.btCombo = null;
        this.btRight = null;
        this.status = this.COMBO_PANE

        this.setProps(props);
    }

    setBtLeft(value){
        this.btLeft = PreviewerNav.setSelector(value);
    }

    setBtCombo(value){
        this.btCombo = PreviewerNav.setSelector(value);
    }

    setBtRight(value){
        this.btRight = PreviewerNav.setSelector(value);
    }

    isNavStatus(value){
        return value === this.LEFT_PANE || this.COMBO_PANE  || this.RIGHT_PANE
    }

    setNavStatus(value){
        this.status = (this.isNavStatus(value)) ? value : this.COMBO_PANE;
    }

    setProps(props){
        if(ut.isObject(props)){
            this.setBtLeft(props.btLeft);
            this.setBtCombo(props.btCombo);
            this.setBtRight(props.btRight);
            this.setNavStatus(props.status);
        }
    }

    initFromStatus(){
        switch (this.status){
            case this.LEFT_PANE:
                this.setBtLeftActive();
                break;
            case this.COMBO_PANE:
                this.setBtComboActive();
                break;
            case this.RIGHT_PANE:
                this.setBtRightActive();
                break;
        }
    }

    isReady(){
        return ut.isSelector(this.btLeft)
            && ut.isSelector(this.btCombo)
            && ut.isSelector(this.btRight)
            && this.isNavStatus(this.status)
    }

    resetNavActive(){
        document.querySelector(this.btLeft).classList.remove('active');
        document.querySelector(this.btCombo).classList.remove('active');
        document.querySelector(this.btRight).classList.remove('active');
    }

    isBtLeftActive(){
        return document.querySelector(this.btLeft).classList.contains('active');
    }

    setBtLeftActive(){
        if(!this.isBtLeftActive()) {
            this.resetNavActive();
            this.status = this.LEFT_PANE;
            document.querySelector(this.btLeft).classList.add('active');
        }
    }

    isBtComboActive(){
        return document.querySelector(this.btCombo).classList.contains('active');
    }

    setBtComboActive(){
        if(!this.isBtComboActive()) {
            this.resetNavActive();
            this.status = this.COMBO_PANE;
            document.querySelector(this.btCombo).classList.add('active');
        }
    }

    isBtRightActive(){
        return document.querySelector(this.btRight).classList.contains('active');
    }

    setBtRightActive(){
        if(!this.isBtRightActive()){
            this.resetNavActive();
            this.status = this.RIGHT_PANE;
            document.querySelector(this.btRight).classList.add('active');
        }

    }
}

class PreviewerWindow extends ResizableBase{
    constructor(props){
        super();
        this.minWidth = null;
        this.isWide = true;
        this.resizeStarted = false;
        this.mouseLeft = 0
        this.width = 0

        this.setProps(props);
    }

    setProps(props){
        if(ut.isObject(props)){
            this.setMinWidth(props.minWidth);
        }
    }

    setMinWidth(value){
        this.minWidth = PreviewerWindow.setDimValue(value);
    }

    isReady(){
        return PreviewerWindow.isDimValue(this.minWidth)
    }

    isWideWindow(screenWidth){
        return (
            ut.isPositiveNumber(screenWidth)
            && screenWidth >= this.minWidth
        )
    }

    setTypeWindow(){
        this.isWide = this.isWideWindow(window.innerWidth)
        if(debug) {
            console.log(
                `[setResizerState] Resizer is ${this.isWide} - window width: ${this.minWidth} / ${window.innerWidth} :------------------------------------>`
            );
        }
        return this.isWide;
    }

    setMouseLeft(mouseLeft){
        this.mouseLeft = (ut.isPositiveNumber(mouseLeft) ? mouseLeft : null);
    }
}

/**
 * PreviewerHelper class
 * This class is used to resize previewer windows.
 */

class ResizableHelper extends ResizableBase{
    storageKey = null;
    window = null;
    nav = null;
    leftPane = null;
    rightPane = null;
    resizeBar = null;
    constructor(props){
        super()
        this.setProps(props);
        this.getDataFromStorage();
    }


    setWindow(props){
        this.window = new PreviewerWindow(props);
    }

    setNav(props){
        this.nav = new PreviewerNav(props);
    }

    setLeftPane(props){
        this.leftPane = new SidePane(props);
    }

    setRightPane(props){
        this.rightPane = new SidePane(props);
    }

    setResizeBar(props){
        this.resizeBar = new ResizeBar(props);
    }

    setProps(props){
        if(ut.isObject(props)){
            this.setWindow(props.window);
            this.setNav(props.nav);
            this.setLeftPane(props.leftPane);
            this.setRightPane(props.rightPane);
            this.setResizeBar(props.resizeBar);
        }
    }

    isReady(){
        return this.window.isReady()
            && this.nav.isReady()
            && this.leftPane.isReady()
            && this.rightPane.isReady()
            && this.resizeBar.isReady()
    }

    getDataFromStorage(){
        const storageData = DataStorage.getStoreData(this.storageKey);
        if(ut.isObject(storageData)){
            this.setPanesSize(storageData);
            this.nav.setNavStatus(storageData.nav)
        }
    }

    setDataToStorage(){
        return DataStorage.setStoreData(
            this.storageKey,
            this.getDataState()
        );
    }

    getDataState(){
        return {
            left_w: this.leftPane.width,
            right_w: this.rightPane.width,
            resizeBarLeft: this.resizeBar.left,
            nav: this.nav.status,
        }
    }

    getPanesSize(){
        return {
            left_w: this.leftPane.width,
            right_w: this.rightPane.width,
            resizeBarLeft: this.resizeBar.left,
        }
    }

    setPanesSize(size){
        const {left_w, right_w, resizeBarLeft} = size;
        this.leftPane.setWidth(left_w);
        this.rightPane.setWidth(right_w);
        this.resizeBar.setLeft(resizeBarLeft);
    }

    resizePanes(size){
        const {left_w, right_w, resizeBarLeft} = size;
        this.leftPane.resizePane(left_w);
        this.rightPane.resizePane(right_w);
        this.resizeBar.setLeftPosition(resizeBarLeft);
    }

    setAndResizePanes(size){
        this.setPanesSize(size)
        this.resizePanes(size)
    }

    getOffsetWith(element){
        return (ut.isElement(element)) ? element.offsetWidth : null;
    }

    getOffsetLeft(element){
        return (ut.isElement(element)) ? element.offsetLeft : null;
    }

    resetWindowsSizes(){
        this.leftPane.resetStyle();
        this.rightPane.resetStyle();
        this.resizeBar.resetStyle();
    }

    handleResizeWindow(){
        const mouseX = this.window.mouseLeft,
            left_pane = this.leftPane.getElement(),
            left_x = this.getOffsetLeft(left_pane),
            right_x = this.getOffsetLeft(this.rightPane.getElement()),
            right_w = this.getOffsetWith(this.resizeBar.getElement()),
            window_w = window.innerWidth,
            is_min_left = (mouseX >= this.leftPane.minWidth),
            is_min_right = (mouseX <= window_w - this.rightPane.minWidth);

        if(is_min_left && is_min_right ){
            // Get container width
            const container = left_pane.parentElement,
                container_width = this.getOffsetWith(container);
            // Get width of left and right panes in pixel

            const left_px = (mouseX - left_x),
                right_px = ((right_x + right_w) - mouseX);

            // and Transform width values in %
            const left_width = ut.toFixedFloat(left_px * 100 / container_width),
            right_width = ut.toFixedFloat(right_px * 100 / container_width);

            this.setAndResizePanes({
                left_w: left_width,
                right_w:  right_width,
                resizeBarLeft: mouseX
            });
        }
    }

    isOnResize(){
        return this.window.resizeStarted;
    }

    startResize(){
        this.window.resizeStarted = true;
    }

    endResize(){
        this.window.resizeStarted = false;
        this.nav.setBtComboActive();
        this.setDataToStorage();
    }
    setMouseLeft(mouseLeft){
        this.window.setMouseLeft(mouseLeft);
    }

    getLeftPaneStyle(){
        return this.leftPane.getStyle();
    }

    getRightPaneStyle(){
        return this.rightPane.getStyle();
    }

    getResizeBarStyle(){
        return this.resizeBar.getStyle();
    }

    expandLeftPane(){
        this.nav.setBtLeftActive();
        this.resetWindowsSizes();
        if(this.window.isWide){
            const windowWidth = window.innerWidth;
            this.resizePanes({
                left_w: windowWidth,
                right_w:  0,
                resizeBarLeft: windowWidth
            });
        }else{
            const left_pane = this.leftPane.getElement(),
                right_pane = this.rightPane.getElement();

            left_pane.style.height = "100vh";
            right_pane.style.display = 'none';
        }
        this.setDataToStorage();
    }

    expandRightPane(){
        this.nav.setBtRightActive();
        this.resetWindowsSizes();
        if(this.window.isWide){
            this.resizePanes({
                left_w: 0,
                right_w:  window.innerWidth,
                resizeBarLeft: 0
            });
        }else{
            const left_pane = this.leftPane.getElement(),
                right_pane = this.rightPane.getElement();
            right_pane.style.height = "100vh";
            left_pane.style.display = 'none';
        }
        this.setDataToStorage();
    }

    hasComboDataView(){
        return ut.isPositiveNumber(this.leftPane.width)
            && ut.isPositiveNumber(this.rightPane.width)
            && ut.isPositiveNumber(this.resizeBar.left)
    }

    loadComboView(){
        this.getDataFromStorage();
        if(this.window.isWide){
            this.nav.setBtComboActive();
            this.resetWindowsSizes();
            if(this.hasComboDataView()){
                this.resizePanes(this.getPanesSize());

            }else{
                const windowWidth = parseInt(window.innerWidth/2);
                this.setAndResizePanes({
                    left_w: windowWidth,
                    right_w:  windowWidth,
                    resizeBarLeft: windowWidth
                });
            }

        }else{
            switch(this.nav.status){
                case this.RIGHT_PANE:
                    this.expandRightPane();
                    break;
                default:
                    this.expandLeftPane();
                    break;
            }
        }
    }

    loadView(){
        switch(this.nav.status){
            case this.LEFT_PANE:
                this.expandLeftPane();
                break;
            case this.RIGHT_PANE:
                this.expandRightPane();
                break;
            case this.COMBO_PANE:
                this.loadComboView();
                break;
            default:
                if(this.window.isWide){
                    this.loadComboView();
                }else{
                    this.expandLeftPane();
                }
                break;
        }
    }

    resizeView(){
        const back = this.window.isWide
        if(this.window.setTypeWindow() !== back){
            this.loadView();
        }
    }

    ExpandWindow(element){
        if(ut.isElement(element)){
            const controls = element.getAttribute('aria-controls');
            const is_wide = this.window.isWide
            if(this.window.setTypeWindow() !== is_wide){
                this.resetWindowsSizes();
            }
            switch(controls){
                case 'm8_left_body':
                    this.expandLeftPane();
                    break;
                case 'm8_right_body':
                    this.expandRightPane();
                    break;
                default:
                    break;
            }

        }
    }

}

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
    const result = marked.parse(text)
    return sanitize_md(result)
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
    toFixedFloat: (fNum) => {
        return parseFloat(fNum.toFixed(2));
    },
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
        return ut.isNumber(value) && value > 0
    },
    isStr: (value) => {
        return (typeof value === 'string' || value instanceof String)
    },
    /*
    * Test if value is valid key.
    *
    */
    isKey: (value) => {
        return ut.isStr(value) && /(?=\w{1,30}$)^([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)$/.test(value)
    },

    /*
    * Test if value is valid attribute key.
    *
    */
    isAttrKey: (value) => {
        return ut.isStr(value) && /(?=[a-zA-Z0-9\-_]{1,80}$)^([a-zA-Z0-9]+(?:[_\-][a-zA-Z0-9]+)*)$/.test(value)
    },
    queryCheck: (s) => {
        return document.createDocumentFragment().querySelector(s)
    },
    isSelector: (selector)=>{
        try{
            ut.isStr(selector) && ut.queryCheck(selector)
        }catch{
            return false
        }
        return true;
    },
    isElement: (element)=>{
        return ut.isObject(element)
    }

}