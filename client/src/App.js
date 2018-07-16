import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Tracer, ExplicitContext, BatchRecorder, jsonEncoder, Annotation } from 'zipkin';
import wrapAxios from 'zipkin-instrumentation-axios';
import { HttpLogger } from 'zipkin-transport-http';

const { JSON_V2 } = jsonEncoder;

const zipkinBaseUrl = 'http://localhost:9411';
const tracer = new Tracer({
    ctxImpl:new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${zipkinBaseUrl}/api/v2/spans`,
            jsonEncoder: JSON_V2,
            axios,
        }),
    }),
    localServiceName: 'react-client',
});


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {inputvalue: '',tracer , axios: wrapAxios(axios ,{tracer})};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){

    }

    handleChange(event) {
        this.setState({inputvalue: event.target.value});
    }

    handleSubmit(event) {
        this.state.tracer.local('answer-me', () =>
            axios.get(`http://localhost:8083/hello?val=${this.state.inputvalue}`).then(response => {
                alert(response.data);
            }),
            this.setState({inputvalue: ''})
        );

    }


    render() {
     return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
            <form onSubmit={this.handleSubmit}>
                <label>
                    <input type="text" value={this.state.inputvalue} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </p>
      </div>
    );
  }
}

export default App;
