# SearchX Front End

SearchX is a scalable collaborative search system being developed by [Lambda Lab](http://www.wis.ewi.tudelft.nl/projects/learning-analytics/) of [TU Delft](https://www.tudelft.nl/).
It is based on [Pineapple Search](http://onlinelibrary.wiley.com/doi/10.1002/pra2.2016.14505301122/full) and is further developed to facilitate collaborative search and sensemaking.

Apart from serving the interface, the front end also manages user data and defines the logs sent back to the back end.
It is built on NodeJS using the [React](https://reactjs.org/) + [Flux](https://facebook.github.io/flux/) framework and is served through [webpack](https://webpack.js.org/).

# Setup

- Make sure the [SearchX back end](https://github.com/felipemoraes/searchx-api) is up and running.

- Configure the back end API address in `webpack.config.js`:
```
externals: {
    'config': JSON.stringify(process.env.ENV === 'production' ? {
        serverUrl: "https://myserver.com"
    } : {
        serverUrl: "http://localhost:4443"
    })
}
```

- Install all dependencies:
```
// Install webpack
npm i babel webpack webpack-dev-server

// Install rest of dependencies
npm update
```

- Start the development server:
```
npm start

// Now check http://localhost:8080/search
```

# Modifications

## Logs
To add a new log, you should add a new log event type to `utils/LoggerEventTypes.js` 
and then call the `log` function from `utils/Logger.js` using the new event type. 
The logger will automatically add information on the current user state. 
Any action specific log data can be inserted as an argument when calling the `log` function.

## Tasks
The learning task is defined inside `app/tasks/learning`.
The forms and interface is defined in the front end, whereas the learning topics and group creation is managed by the back end.
All form uses [surveyjs](https://surveyjs.io/Overview/Library/) and the results are sent to the back end as logs.

### Modifying the learning task
1. Changing task duration and type  
To change the task duration and task type, you can modify the values inside `config.js`.

2. Changing the pretest / posttest
The form questions are defined inside `app/tasks/learning/LearningPages.js` 
while the form behavior is defined inside `app/tasks/learning/forms`. 
To change the questions, you can change the `elements` inside `LearningPages.js`.

```
// EXAMPLE FORM QUESTIONS

let elements = []
let pages = []

elements.push({
    title: "How many questions?",
    name: "question-numbers",
    type: "text",
    inputType: "number",
    width: 600,
    isRequired: true
});

elements.push({
    title: "What is the question?",
    name: "question-name",
    type: "comment",
    inputType: "text",
    width: 600,
    rows: 4,
    isRequired: false
});
        
pages.push({elements:  elements});
```

### Creating a custom search task
The search interface can be found inside `app/search`, while task specific code can be found inside `app/tasks`.
If you need to extend the interface for a specific task, you should create a new component inside `app/tasks`, and then insert the search interface as a react component. 
You would then need to create a new route for the new component inside `app/App.js`.

## Adding search interface features
The main search interface layout can be found inside `app/search/Search.js`. 
To add a new feature to the search interface, you should a new [react component](https://reactjs.org/docs/components-and-props.html) inside `app/search/feature`, 
and then insert the new feature component inside the layout. 

```
// EXAMPLE COMPONENT

export default class NewComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            // component data
        };
    }

    render() {
        return (
            // html written using jsx
        );
    }
}
```

## Search providers
SearchX supports multiple search providers, which provide the search results that SearchX shows to the user. The Bing and Elasticsearch providers are supported out of the box, respectively providing internet search and full text search on custom datasets.

Each provider can support one or more verticals. For example, the Bing provider provides four verticals: Web, Images, Videos and News. Verticals are shown to the user in the top menu and they can switch between verticals while retaining their current query.

### Adding a new vertical or provider
If you want to add a new vertical or provider, first the searchx-backend needs to be adapted to return the data for your result. See the [searchx-backend documentation](https://github.com/felipemoraes/searchx-backend#search-providers) for instructions on how to do this.

The new vertical or provider needs to be added to the verticalProviders mapping in `src/js/config.js`. The first level of the map contains the provider name as key, and a map as value. The second level contains the vertical name as key, and a reference to the react component that will be used to display the search result as value. You can add your own verticals and providers to this map. Every provider needs to have at least one vertical.

If you wish to add your own component to display search results, add it to `src/js/app/search/results/components/types`, and reference it in the verticalProviders map.

# License

[MIT](https://opensource.org/licenses/MIT)