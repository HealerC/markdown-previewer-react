import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import marked from 'marked';          // Library that will be parsing the text
import './previewerCSS.css';          // The styles it will apply to the output
marked.setOptions({                 
    // So that new line will be parsed as line break (optional bonus) 
    gfm: true,
    breaks: true
});

class Previewer extends React.Component {
    /*
     *  The previewer's role is simple. Get the user-typed markdown text from the
     *  parent "App" and display it in HTML form. It can toggle between pure html
     *  markup text or render it as it would in a browser (default).
     *  
     *  Pure HTML used here means text rendered using the HTML tags 
     */
    constructor(props) {
        super(props);
        this.state = {
            isHTMLView: false           // Default value. Render as normal
        }
        this.getMarkedText = this.getMarkedText.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.closeComponent = this.closeComponent.bind(this);
        this.toggleMaximize = this.toggleMaximize.bind(this);
    }
    getMarkedText(text) {
        return marked(text);
    }
    toggleView() {
        /*
         *  Toggle between showing the rendered HTML or the pure (with all its tags)
         */
        this.setState(state => ({
            isHTMLView: !state.isHTMLView
        }));
    }
    closeComponent() {
        /*
         *  Tells the parent "App" it wants to close by passing it its identity
         */
        this.props.handleClose(this.props.identity);
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
    render() {
        return (
            <div id="previewerPane" style={this.props.style}>
                <div id="titleBar">
                    <h2>Previewer #{this.props.identity}</h2>
                    <span id="actionButtons">
                      {/* Render icon either HTML or pure HTML (HTML with tags) */}
                      { this.state.isHTMLView ? 
                        <FontAwesomeIcon icon={["fab", "markdown"]} onClick={this.toggleView} size="lg" 
                          className="icon" title="Markdown view" /> :
                        <FontAwesomeIcon icon={["fas", "code"]} onClick={this.toggleView} size="lg" 
                          className="icon" title="HTML View" /> }
                    
                      {/* Renders maximize/restore icons based on whether it is the maximized component*/}
                      { this.props.identity === this.props.maximized ? 
                        <FontAwesomeIcon icon="window-restore" size="lg"  
                          className="icon" onClick={this.toggleMaximize} title="Restore"/> :
                        <FontAwesomeIcon icon="window-maximize" size="lg"  
                          className="icon" onClick={this.toggleMaximize} title="Maximize" /> }
                  
                      {/* It is only previewers that can be closed. */}
                      <FontAwesomeIcon icon={["fas", "times"]} onClick={this.closeComponent} size="lg"  
                        className="icon" title="Delete previewer" />
                    </span>
                </div>
                
                {/* The HTML output */}
                { this.state.isHTMLView ? 
                  <div id={this.props.id}>{this.getMarkedText(this.props.text)}</div> : 
                  <div id={this.props.id} dangerouslySetInnerHTML=
                      {{__html: this.getMarkedText(this.props.text)}}></div> }
            </div>
        );
    }
}

export default Previewer;