const placeholder = `
# My Markdown Previewer
## The markdown previewer was made with React, Sass, marked (library used to parse the markdown text), fontawesome icons and others
I think this is an opportunity to learn some of markdown rules
Here goes some links:
1. [React](https://reactjs.org/)
1. [Font awesome](https://fontawesome.com/)
1. [Sass](https://sass-lang.com/)
1. [Marked](https://marked.js.org/)
Also let me not forget my own codepen link ;)
1. [HealerC](https://codepen.io/HealerC)

There's one of my favourite verses of the bible
> For God has not given us a spirit of fear, but of **power** and of **love** and of a **sound mind**. (2 Timothy 1:7 NKJV)

Let's write some Javascript
\`\`\`
function printHelloWorld10Times() {
  for (let i = 0; i < 10; i++) {
    console.log("Hello World");
  }
}
\`\`\`
Here's an inline code \`printHelloWorld10Times();\`

The reason I made this markdown previewer to be able to add _two_ previewers is because I wanted it to be possible for someone to be able to view both the output HTML **_with tags_** as well as the output HTML _**the way it will be viewed in a browser**_ real time.

Web development _languages_

Front-end | Back-end|
----------|---------|
HTML/CSS      | Node, PHP, Python etc
Javascript | SQL


Well if you want to talk about libraries and frameworks thats a different ball game cause we have amongst others

- Bootstrap
- JQuery
- React, Vue, Angular
- Laravel
- Django
etc.

I'll learn them :)

Let's see a ~programming~ medical picture

![Medical Picture](https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80)
Or let's see _two_ medical pictures

![Medical Picture 2](https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=735&q=80)
`;
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

marked.setOptions({                 
    // So that new line will be parsed as line break (optional bonus) 
    gfm: true,
    breaks: true
});

const { onMaximizeMain, onMaximizeOthers } = WindowSizes;
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
            editorText: placeholder,         // Markdown text
            previewerCount: 1,      // The total number of previewers rendered so far
            previewerIDs: [1],      // The identities of the previewers rendered presently
            maximizedComponent: 0   // The identity of the component maximized. 
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
                      <i className="fas fa-trash fa-lg icon" onClick={this.props.handleClear} title="Clear Editor"></i>
                      {/* Renders maximize/restore icons based on whether it is the maximized component*/}
                      { this.props.identity === this.props.maximized ? <i className="far fa-window-restore fa-lg icon" onClick={this.toggleMaximize} title="Restore"></i> : <i className="far fa-window-maximize fa-lg icon" onClick={this.toggleMaximize} title="Maximize"></i> }
                        <i className="fas fa-plus fa-lg icon" onClick={this.props.handleAddPreviewer} title="Add previewer" ></i>
                    </span>
                </div>

                {/* The markdown input */}
                <textarea onChange={this.props.handleChange} onFocus={this.focusView} onBlur={this.blurView}
                    value={this.props.text} id="editor" style={presentStyle.textAreaShadow} />
            </div>
        );
    }
}

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
        this.preview = React.createRef();
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
    componentDidUpdate() {
      const preview = this.preview.current;
      if (preview.scrollHeight - preview.scrollTop !== preview.clientHeight) {
        // So that the previewer scrolls to the bottom of the component as it updates.
        preview.scrollTop = preview.scrollHeight;
      }
    }
    render() {
        return (
            <div id="previewerPane" style={this.props.style}>
                <div id="titleBar">
                    <h2>Previewer #{this.props.identity}</h2>
                    <span id="actionButtons">
                      {/* Render icon either HTML or pure HTML (HTML with tags) */}
                      { this.state.isHTMLView ? <i className="fab fa-markdown fa-lg icon" onClick={this.toggleView} title="Markdown view"></i> :
                        <i className="fas fa-code fa-lg icon" onClick={this.toggleView} title="HTML View"></i> }
                    
                      {/* Renders maximize/restore icons based on whether it is the maximized component*/}
                      { this.props.identity === this.props.maximized ? <i className="far fa-window-restore fa-lg icon" onClick={this.toggleMaximize} title="Restore"></i> : <i className="far fa-window-maximize fa-lg icon" onClick={this.toggleMaximize} title="Maximize"></i> }
                  
                      {/* It is only previewers that can be closed. */}
                      <i className="fas fa-times fa-lg icon" onClick={this.closeComponent} title="Delete previewer"></i>  
                  </span>
                </div>
                
                {/* The HTML output */}
                { this.state.isHTMLView ? 
                  <div id={this.props.id} ref={this.preview}>{this.getMarkedText(this.props.text)}</div> : 
                  <div id={this.props.id} ref={this.preview} dangerouslySetInnerHTML=
                      {{__html: this.getMarkedText(this.props.text)}}></div> }
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
