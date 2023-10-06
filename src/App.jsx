import {ResizableContainer} from './components/resizableContainer.jsx'
import './css/main.css'
import {InputEditor} from "./components/mdEditor.jsx";
import {HtmlPreview} from "./components/mdPreview.jsx";

function App() {
  const leftPane = <InputEditor/>
  const rightPane = <HtmlPreview/>
  return <ResizableContainer
      leftPane={leftPane}
      rightPane={rightPane}
  />
}

export default App
