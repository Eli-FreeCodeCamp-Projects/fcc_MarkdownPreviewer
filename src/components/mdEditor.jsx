import { useEffect } from 'react'
import {defaultInput} from "../utils/defaultInput.js";
import {useDispatch } from 'react-redux'
import {refreshPreview} from '../features/mdPreviewer/mdPreviewerSlice';

/**
 * Editor Component
 */
export function InputEditor(){
    const dispatch = useDispatch()
    useEffect(() => {
        const element = document.getElementById('editor');
        if(!element.value){
            element.value = defaultInput;
        }
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        dispatch(refreshPreview(value))
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