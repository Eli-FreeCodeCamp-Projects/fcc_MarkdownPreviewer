import { createSlice } from '@reduxjs/toolkit'
import {parse_markdown} from '../../utils/markedParser.js'
import {defaultInput} from '../../utils/defaultInput.js'

const mdPreviewerSlice = createSlice({
    name: 'mdPreviewer',
    initialState: {
        status: true,
        error_msg: '',
        min_resize_width: 768,
        input_text: defaultInput,
        output_text: parse_markdown(defaultInput)
    },
    reducers: {
        refreshPreview: {
            reducer(state, action) {
                // ✅ This "mutating" code is okay inside of createSlice!
                state.input_text = action.payload.input_text
                state.output_text = action.payload.output_text
            },
            prepare(input_text) {
                const output_text = parse_markdown(input_text)
                return {
                    payload: { input_text, output_text }
                }
            }

        }
    }
})

export const { refreshPreview } = mdPreviewerSlice.actions

export const selectPreview = state => state.mdPreviewer.output_text
export default mdPreviewerSlice.reducer