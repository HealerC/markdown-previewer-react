import React from 'react';
import Editor from './editor.js';
import Previewer from './previewer.js';
import './app.scss';

/* Fontawesome icons */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore, faWindowMaximize } from '@fortawesome/free-regular-svg-icons';

/* Maximizing and restoring */
import { WindowSizes } from './instance-state-styles.js';

library.add(fab, fas, faWindowRestore, faWindowMaximize);       // fontawesome
let { onMaximizeMain, onMaximizeOthers } = WindowSizes;         // maximizing and restoring

class App extends React.Component {
    /*
     *  The app handles most things in the markdown previewer app
     *  from the markdown text to the number of previewers as well as the 
     *  layout of the app which changes as the number of previewers as well as their
     *  maximized property changes.   
     *  To do this it sends a lot of props to the children to tell them
     *  what to show and how they should arrange
     */
    constructor(props) {
        super(props);
        this.state = {
            editorText: "",         // Markdown text
            previewerCount: 1,      // The total number of previewers rendered so far
            previewerIDs: [1],      // The identities of the previewers rendered presently
            maximizedComponent: 0   // The identity of the component rendered. 
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.addPreviewer = this.addPreviewer.bind(this);
        this.closePreviewer = this.closePreviewer.bind(this);
        this.handleMaximize = this.handleMaximize.bind(this);
        this.createPreviewer = this.createPreviewer.bind(this);
    }
    handleChange(event) {
        /* When there's a change to the child editor component it should update its state */
        this.setState({
            editorText: event.target.value
        });
    }
    handleClear() {
        /* Remove all the text from the editor */
        this.setState({
            editorText: ""
        });
    }
    addPreviewer() {
        /* It should add to the previewers presently rendered by using the total
        count of previewers as the identity for the next. Only two previewers are supported */
        if (this.state.previewerIDs.length < 2) {
            // Only two previewers can be added
            this.setState(state => {
                const nextDigit = state.previewerCount+1;
                return {
                    previewerIDs: state.previewerIDs.concat(nextDigit),
                    previewerCount: nextDigit
                }
            });
        }
    }
    closePreviewer(identity) {
        /* The previewer that wants to be deleted will provide its identity and 
        the program just removes the identity from the identities saved in the state 
        as an array - previewerIDs */
        this.setState(state => {
            const index = state.previewerIDs.indexOf(identity);
            state.previewerIDs.splice(index, 1);
            return {
                previewerIDs: state.previewerIDs
            }
        });
    }
    handleMaximize(identity) {
        /* Only one component can be maximized at a time so when a new component
        wants to be maximized the previously maximized component is overwritten
        or if it wants to be minimized, it will pass -1 to the method and then
        maximized component is set to 0. No component will be maximized then */
        if (identity !== -1) {
            this.setState({
                maximizedComponent: identity
            });
        } else {
            this.setState({
                maximizedComponent: 0
            });
        }
    }
    createPreviewer(key, identity, style, maximized) {
        /* This method creates and returns a previewer with a props
        * which would be the arguments passed to the method */
        return (<Previewer text={this.state.editorText} key={key} handleClose={this.closePreviewer} 
          handleMaximize={this.handleMaximize} identity={identity} id="preview" 
          style={style} maximized={maximized} />);
    }
    render() {
        let previewerList = [];     // The previewers to be rendered
        let flexBasisValue = 0;     // The flex basis used when there is no maximized component
        let editorStyle = {};       // The style the editor will use depending on the state
        let key = 0;                // The key of each previewer (required in react)
        let identity = 0;           // The identity of each previewer (used in program)
        let style = {};             // The style that will be applied to each previewer
        let maximized = this.state.maximizedComponent;          // The presently maximized component
        for (let i = 0; i < this.state.previewerIDs.length; i++) {
            // Data for the present previewer in the array
            key = this.state.previewerIDs[i];       // required by react
            identity = this.state.previewerIDs[i];

            if (maximized) {
                // A component was maximized - It can be either string 'editor' or the identity integer
                // of the component if it is a previewer.
                if (maximized === 'editor') {
                    // An editor was maximized
                    editorStyle = onMaximizeMain;
                    
                    // For this previewer
                    style = onMaximizeOthers;
                    previewerList.push(this.createPreviewer(key, identity, style, maximized));
                  } else if (maximized > 0) {
                    // One of the previewers is maximized so we need to find out which
                    if (maximized === identity) {
                        // This is the component presently being maximized
                        style = onMaximizeMain;
                        previewerList.push(this.createPreviewer(key, identity, style, maximized));    
                    } else {
                        // A previewer is being maximized but not this one
                        style = onMaximizeOthers;
                        previewerList.push(this.createPreviewer(key, identity, style, maximized));    
                    }
                    
                    // The editor was not the one maximized
                    editorStyle = onMaximizeOthers;
                }
            }
            else {
                // No maximized component - The style to use depends on the number of components
                flexBasisValue = this.state.previewerIDs.length === 1 ? "40%" : "30%"
                editorStyle = {flexBasis: flexBasisValue};
                
                style = editorStyle;        // This time the editor and all the previewers
                                            // have the same style
                previewerList.push(this.createPreviewer(key, identity, style, maximized));    
            }
                
        }   
        return (
            <div>
                <header>
                    <h1>Markdown Previewer</h1>
                </header>
                <div id="workspace"> 
                    <Editor text={this.state.editorText} handleChange={this.handleChange} 
                        handleMaximize={this.handleMaximize} handleAddPreviewer={this.addPreviewer} 
                        handleClear={this.handleClear} identity="editor" 
                        maximized={this.state.maximizedComponent} style={editorStyle} />
                    {previewerList}
                </div>
                <div id="credits">Credits:
                    <a href="https://marked.js.org/" id="marked" title="marked library" 
                      target="_blank" rel="noopener noreferrer">marked</a>,&nbsp;
                    <a href="https://codepen.io/HealerC" id="me" title="codepen@HealerC" 
                      target="_blank" rel="noopener noreferrer">me</a>
                </div>
            </div>
        );
    }
}

export default App;