import {DataStorage} from './dataStorage.js'
import {ut} from './utils.js'
/**
 * ResizableBase class
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
 * ResizeBar class
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
 * PreviewerNav class
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

/**
 * PreviewerWindow class
 */
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
        this.isWide = this.isWideWindow(window.innerWidth);
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

export class ResizableHelper extends ResizableBase{
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

    /**
     * Set window class props
     * Define a min width for resize limit.
     * @param props {{minWidth: Number}} The min with of window to limit resize.
     */
    setWindow(props){
        this.window = new PreviewerWindow(props);
    }

    /**
     * Set Nav bar class props
     * Define the nav buttons selectors.
     * @param props {{btLeft: string, btCombo: string, btRight: string }} The css selector of nav buttons .
     */
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

    /**
     * Test if all properties are ready.
     * @return {boolean} Return true if all components are ready or false elsewhere.
     */
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



