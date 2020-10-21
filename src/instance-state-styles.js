/*
 *  Just the style in Javascript Object Form of the Components when they are maximized
 *  or restored AND
 *  The Editor when it has or has lost the focus.
 */
const WindowSizes = {
    onMaximizeMain: {           // The maximized component
        flexBasis: "100%",
        order: 1
    },
    onMaximizeOthers: {         // The other components when there is a maximized component
        flexBasis: "40%",
        flexGrow: 0,
        order: 2
    }
}

const EditorStates = {
    onFocus: {                  // When the editor has focus
        titleBar: {
            backgroundColor: "rgb(245, 134, 52)"
        },
        textAreaShadow: {
            boxShadow: "0 4px 8px 0 rgba(245, 134, 52, 0.5), 0 6px 20px 0 rgba(245, 134, 52, 0.19)"
        },
    },
    onBlur: {                   // When the editor has lost focus
        titleBar: {
            backgroundColor: "gray"
        },
        textAreaShadow: {
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        }
    }
}
export { WindowSizes, EditorStates };