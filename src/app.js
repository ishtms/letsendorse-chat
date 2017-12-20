import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Image} from 'semantic-ui-react';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import MainChat from './components/main';
import SecondChild from './components/second';
import FirstChild from './components/first';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        axios
            .get('/all')
            .then((response)=>{
                this.setState({data: response.data.data});
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    render(){
        return (
            <Grid columns={3} divided>
                <Grid.Row>
                <Grid.Column>
                  <div className="wrapper" style={{height: "100vh"}}>
                    <Route path="/" component={MainChat}>
                    </Route>
                  </div>
                </Grid.Column>
                <Grid.Column>
                <div className="wrapper" style={{height: "100vh"}}>
                    <Route path="/view/:id" component={FirstChild} />
                </div>
                </Grid.Column>
                <Grid.Column>
                <div className="wrapper" style={{height: "100vh"}}>
                     <Route exact path="/view/:id/:childId" component={SecondChild}/>
                </div>
                </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }
}

ReactDOM.render(<BrowserRouter>
                    <App/>
                </BrowserRouter>, document.getElementById('app'));