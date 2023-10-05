/**
 * Output Component
 */
import { useSelector } from 'react-redux'
import {selectPreview} from '../features/mdPreviewer/mdPreviewerSlice';
export function HtmlPreview(){
    const output_text = useSelector(selectPreview)
    return(
        <div
            id="preview"
            className={`container-fluid h-100`}
            dangerouslySetInnerHTML={{ __html: output_text }}
        />
    )
}