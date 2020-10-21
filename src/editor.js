import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorStates } from './instance-state-styles.js';
const { onFocus, onBlur } = EditorStates;

class Editor extends React.Component {
    /*
     *  This editor displays what it is given from it's parent app
     *  It basically handles changes in its textarea value and passes is it to its
     *  parent (App) which then (The App) passes it back to it to render it.
     *  It renders different colours when it has/lost the input focus 
     */
    constructor(props){
        super(props);
        this.state = {
            isFocused: false         // Does the component have the input focus?
        }
        this.focusView = this.focusView.bind(this);
        this.blurView = this.blurView.bind(this);
        this.toggleMaximize = this.toggleMaximize.bind(this);
    }
    toggleMaximize() {
        /* If it is not maximized it tells the "App" it wants to be maximized
           by passing its "identity" but if it wants to be restored,
           it also tells the app by passing -1. It knows which component
           is maximized because the maximized component was passed as one of the props */
        if (this.props.identity === this.props.maximized) {
            this.props.handleMaximize(-1);    
        } else {
            this.props.handleMaximize(this.props.identity);
        }
    }
    focusView() {
        /* Does it have focus? */
        this.setState({
            isFocused: true
        });
    }
    blurView() {
        /* Has it lost focus? */
        this.setState({
            isFocused: false
        });
    }
    render() {
        let presentStyle = {};          // The style to render will depend on its focus
        if (this.state.isFocused) {
            presentStyle = onFocus;
        } else {
            presentStyle = onBlur;
        }
        return (
            <div id="editorPane" style={this.props.style}>
                <div id="titleBar" style={presentStyle.titleBar}>
                    <h2>Editor</h2>
                    <span id="actionButtons">
                      <FontAwesomeIcon icon={["fas", "trash"]} onClick={this.props.handleClear} size="lg"  
                        className="icon" title="Clear Editor" />
                      
                      {/* Renders maximize/restore icons based on whether it is the maximized component*/}
                      { this.props.identity === this.props.maximized ? 
                         <FontAwesomeIcon icon="window-restore" size="lg"  
                           className="icon" onClick={this.toggleMaximize} title="Restore" /> :
                          <FontAwesomeIcon icon="window-maximize" size="lg"  
                            className="icon" onClick={this.toggleMaximize} title="Maximize" /> }
                        
                        <FontAwesomeIcon icon={["fas", "plus"]} onClick={this.props.handleAddPreviewer} 
                          size="lg" className="icon" title="Add previewer" />
                    </span>
                </div>

                {/* The markdown input */}
                <textarea onChange={this.props.handleChange} onFocus={this.focusView} onBlur={this.blurView}
                    value={this.props.text} id="editor" style={presentStyle.textAreaShadow} />
            </div>
        );
    }
}

export default Editor;