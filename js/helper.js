/**
 * Helper functions
 */
const debug = true,
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
        "![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\n",
    SESSION_STORAGE = "SESSION_STORAGE",
    LOCAL_STORAGE = "LOCAL_STORAGE";

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
     * @return {any}
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


class PreviewerHelper{
    COMBO_PANE = 'COMBO_PANE'
    LEFT_PANE = 'LEFT_PANE'
    RIGHT_PANE = 'RIGHT_PANE'
    DISPLAY_VERTICAL = 'DISPLAY_VERTICAL';
    DISPLAY_HORIZONTAL = 'DISPLAY_HORIZONTAL';

    constructor(props){
        this.storageKey = "m8Prv_sizes";
        this.window = {
            minWidth: 768,
            isWide: true,
            resizeStarted: false,
            mouseLeft: 0,
            width: null
        };
        this.nav = {
            left: '#m8-left-expand',
            combo: '#m8-expand-combo',
            right: '#m8-right-expand',
            status: this.COMBO_PANE
        }
        this.editor = {
            selector: '#previewer .editor-container',
            nav: '#m8-left-expand',
            width: null,
            left: null,
            minWidth: 150
        };
        this.preview = {
            selector: '#previewer .preview-container',
            nav: '#m8-right-expand',
            width: null,
            left: null,
            minWidth: 150
        };
        this.resizeBar = {
            selector:  '#previewer .size-container',
            left: null
        };
        this.setProps(props)
    }

    getPaneStatus(){
        return this.nav.status
    }
    setWindowProps(props){
        if(ut.isObject(props) && ut.isPositiveNumber(props.minWidth)){
            this.window.minWidth = props.minWidth
        }
    }
    setEditorProps(props){
        if(ut.isObject(props)){
            this.editor.selector = (ut.isSelector(props.selector)) ? props.selector : this.editor.selector;
            this.editor.minWidth = (ut.isNumber(props.minWidth)) ? props.minWidth : this.editor.minWidth;
        }
    }
    setPreviewProps(props){
        if(ut.isObject(props)){
            this.preview.selector = (ut.isSelector(props.selector)) ? props.selector : this.preview.selector;
            this.preview.minWidth = (ut.isNumber(props.minWidth)) ? props.minWidth : this.preview.minWidth;
        }
    }
    setResizeBarProps(props){
        if(ut.isObject(props)){
            this.resizeBar.selector = (ut.isSelector(props.selector)) ? props.selector : this.resizeBar.selector;
        }
    }
    setProps(props){
        if(ut.isObject(props)){
            this.setWindowProps(props.window)
            this.setEditorProps(props.editor)
            this.setPreviewProps(props.preview)
            this.setResizeBarProps(props.resizeBar)
        }
    }

    static getPaneStyle(size){
        if(ut.isPositiveNumber(size)){
            return {
                width: `${size}px`,
                visibility: 'visible'
            }
        }else if(ut.isNumber(size) && size === 0){
            return{
                visibility: 'hidden'
            }
        }else{
            return null;
        }

    }

    getOffsetWith(obj){
        const element = document.querySelector(obj.selector)
        return (ut.isElement(element)) ? element.offsetWidth : null;
    }

    getOffsetLeft(obj){
        const element = document.querySelector(obj.selector)
        return (ut.isElement(element)) ? element.offsetLeft : null;
    }
    getEditorWith(){
       return this.editor.width;
    }
    setEditorWith(width){
        if(ut.isNumber(width)){
            this.editor.width = width
            return true;
        }
        return false;
    }
    getEditorStyle(){
        return PreviewerHelper.getPaneStyle(this.editor.width);
    }

    getPreviewWith(){
        return this.preview.width;
    }
    setPreviewWith(width){
        if(ut.isNumber(width)){
            this.preview.width = width
            return true;
        }
        return false;
    }
    getPreviewStyle(){
        return PreviewerHelper.getPaneStyle(this.preview.width);
    }

    getResizeBarLeft(){
        return this.resizeBar.left;
    }
    setResizeBarLeft(left){
        if(ut.isNumber(left)){
            this.resizeBar.left = left
            return true;
        }
        return false;
    }
    getResizeBarStyle(){
        const leftPos = this.resizeBar.left
        if(ut.isNumber(leftPos) && leftPos >= 0){
            return {
                left: `${leftPos}`
            };
        }
        return null;
    }
    getDataView(){
        return {
            left_w: this.getEditorWith(),
            right_w: this.getPreviewWith(),
            resizeBarLeft: this.getResizeBarLeft(),
            nav_status: this.nav.status
        }
    }


    getDataFromStorage(){
        const storageData = DataStorage.getStoreData(this.storageKey);
        if(ut.isObject(storageData)){
            this.setComboSizes(storageData);
        }
    }

    setDataToStorage(){
        return DataStorage.setStoreData(
            this.storageKey,
            this.getDataView()
        );
    }
    isWideWindow(minWidth, screenWidth){
        return (
            ut.isPositiveNumber(screenWidth)
            && ut.isPositiveNumber(minWidth)
            && screenWidth >= minWidth
        )
    }

    setTypeWindow(){
        this.window.isWide = this.isWideWindow(this.window.minWidth, window.innerWidth)
        if(debug) {
            console.log(
                `[setResizerState] Resizer is ${this.window.isWide} - window width: ${this.window.minWidth} / ${window.innerWidth} :------------------------------------>`
            );
        }
        return this.window.isWide;
    }

    setMouseLeft(mouseLeft){
        this.window.mouseLeft = (ut.isPositiveNumber(mouseLeft) ? mouseLeft : null);
    }

    isOnResize(){
        return this.window.resizeStarted;
    }

    startResize(){
        this.window.resizeStarted = true;
    }

    endResize(){
        this.window.resizeStarted = false;
        this.nav.status = this.COMBO_PANE;
        this.setActiveNav('combo');
        this.setDataToStorage();
    }

    /**
     * Resize element width, and set visibility to hidden if width value is <= to zero.
     * @param obj
     * @param width
     */
    resizePane(obj, width) {
        const element = document.querySelector(obj.selector)
        if(ut.isPositiveNumber(width)){
            element.style.visibility = `visible`;
            element.style.width = `${width}px`;
        }else{
            element.style.width = `${0}`;
            element.style.visibility = `hidden`;
        }
    }

    setResizeBarPosition(obj, left){
        const element = document.querySelector(obj.selector);
        if(ut.isNumber(left)){
            element.style.left = `${left}px`;
        }
    }

    resetSizeStyle(obj){
        const element = document.querySelector(obj.selector);
        element.style = null;
    }

    resetAllSizeStyle(){
        this.resetSizeStyle(this.editor)
        this.resetSizeStyle(this.preview)
        this.resetSizeStyle(this.resizeBar)
    }

    setDisplaySize(size){
        const {left_w, right_w, resizeBarLeft} = size;
        this.resizePane(this.editor, left_w);
        this.resizePane(this.preview, right_w);
        this.setResizeBarPosition(this.resizeBar, resizeBarLeft);
    }

    setComboSizes(size){
        const {left_w, right_w, resizeBarLeft} = size;
        this.setEditorWith(left_w);
        this.setPreviewWith(right_w);
        this.setResizeBarLeft(resizeBarLeft);
    }
    setDisplayAndSave(size){
        this.setComboSizes(size)
        this.setDisplaySize(size)
    }
    resizeWindows(){
        const mouseX = this.window.mouseLeft,
            left_x = this.getOffsetLeft(this.editor),
            right_x = this.getOffsetLeft(this.preview),
            right_w = this.getOffsetWith(this.preview),
            window_w = window.innerWidth,
            is_min_left = (mouseX >= this.editor.minWidth),
            is_min_right = (mouseX <= window_w - this.preview.minWidth);
        if(is_min_left && is_min_right ){
            const left_res = mouseX - left_x,
                right_res = ((right_x + right_w) - mouseX);
            this.setDisplayAndSave({
                left_w: left_res,
                right_w:  right_res,
                resizeBarLeft: mouseX
            });
        }
    }

    resetNavActive(){
        document.querySelector(this.nav.left).classList.remove('active');
        document.querySelector(this.nav.combo).classList.remove('active');
        document.querySelector(this.nav.right).classList.remove('active');
    }
    setActiveNav(item){
        this.resetNavActive();
        switch (item){
            case 'left':
                document.querySelector(this.nav.left).classList.add('active');
                break;
            case 'combo':
                document.querySelector(this.nav.combo).classList.add('active');
                break;
            case 'right':
                document.querySelector(this.nav.right).classList.add('active');
                break;
            default:
                document.querySelector(this.nav.combo).classList.add('active');
                break;

        }
    }
    expandEditor(){
        this.setActiveNav('left');
        if(this.window.isWide){
            const windowWidth = window.innerWidth;
            this.setDisplaySize({
                left_w: windowWidth,
                right_w:  0,
                resizeBarLeft: windowWidth
            });
            this.nav.status = this.LEFT_PANE;
        }else{
            const left_pane = document.querySelector(this.editor.selector);
            left_pane.style.display = '';
            left_pane.style.width = '';
            left_pane.style.visibility = '';
            left_pane.style.height = "100vh";
            document.querySelector(this.preview.selector).style.display = 'none';
        }

    }

    expandPreview(){
        this.setActiveNav('right');
        if(this.window.isWide){
            this.setDisplaySize({
                left_w: 0,
                right_w:  window.innerWidth,
                resizeBarLeft: 0
            });
            this.nav.status = this.RIGHT_PANE;
            this.setDataToStorage();
        }else{
            document.querySelector(this.editor.selector).style.display = 'none';
            const right_pane = document.querySelector(this.preview.selector);
            right_pane.style.display = '';
            right_pane.style.width = '';
            right_pane.style.visibility = '';
            right_pane.style.height = "100vh";

        }

    }
    hasComboDataView(){
        return ut.isPositiveNumber(this.editor.width)
            && ut.isPositiveNumber(this.preview.width)
            && ut.isPositiveNumber(this.resizeBar.left)
    }

    loadComboView(){
        this.getDataFromStorage();
        if(this.window.isWide){
            this.nav.status = this.COMBO_PANE;
            const left_pane = document.querySelector(this.editor.selector);
            left_pane.style.display = ''
            left_pane.style.height = ''
            const right_pane = document.querySelector(this.preview.selector);
            right_pane.style.display = ''
            right_pane.style.height = ''
            if(this.hasComboDataView()){
                this.setDisplaySize(this.getDataView());
            }else{
                const windowWidth = parseInt(window.innerWidth/2);
                this.setDisplaySize({
                    left_w: windowWidth,
                    right_w:  windowWidth,
                    resizeBarLeft: windowWidth
                });
            }

            this.setActiveNav('combo');
        }else{
            switch(this.nav.type){
                case this.LEFT_PANE:
                    this.expandEditor();
                    break;
                case this.RIGHT_PANE:
                    this.expandPreview();
                    break;
                default:
                    this.expandEditor();
                    break;
            }
        }
    }

    loadView(){

    }

    resizeView(){
        const back = this.window.isWide
        if(this.setTypeWindow() !== back){
            switch(this.nav.type){
                case this.LEFT_PANE:
                    this.expandEditor();
                    break;
                case this.RIGHT_PANE:
                    this.expandPreview();
                    break;
                case this.COMBO_PANE:
                    this.loadComboView();
                    break;
                default:
                    if(this.window.isWide){
                        this.loadComboView();
                    }else{
                        this.expandEditor();
                    }
                    break;
            }

        }
    }

    ExpandWindow(element){
        if(ut.isElement(element)){
            const controls = element.getAttribute('aria-controls');
            const is_wide = this.window.isWide
            if(this.setTypeWindow() !== is_wide){
                this.resetAllSizeStyle();
            }
            switch(controls){
                case 'm8_left_body':
                    this.expandEditor();
                    break;
                case 'm8_right_body':
                    this.expandPreview();
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
        return parseFloat(fNum.toFixed(1));
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
        return ut.isStr(value) && /(?=[a-zA-Z0-9\-_]{1,80}$)^([a-zA-Z0-9]+(?:(?:_|-)[a-zA-Z0-9]+)*)$/.test(value)
    },
    isSelector: (selector)=>{
        return ut.isStr(selector)
    },
    isElement: (element)=>{
        return ut.isObject(element)
    }

}