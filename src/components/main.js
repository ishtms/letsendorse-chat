import React from 'react';
import { Message, Button, Input } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            username: '',
            message: ''
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
    handleChange(e){
        const StateObject = Object.assign({}, this.state);
        StateObject[e.target.id] = e.target.value;
        this.setState(StateObject);
    }
    handleSubmit(){
        const __id = Date.now().toString();
        axios
            .post('/addComment', {
                username: this.state.username,
                message: this.state.message,
                commentID: __id,
                directComment: []
            }).then(() => {
                let StateObject = Object.assign({}, this.state);
                StateObject.data.push({
                    message: this.state.message,
                    username: this.state.username,
                    commentID: __id,
                    directComment: []
                });
                StateObject.username = '';
                StateObject.message = '';
                this.setState(StateObject);
            }).catch(err=>{
                console.log(err)
            })
    }
    render(){
        let view = this.state.data.map((prop,key) => {
            return <Link key={key} to={`/view/${prop.commentID}`}><Message
                        icon="inbox"
                        header={prop.username}
                        content={prop.message}
                    /></Link>
        })
        return(
            <div><h1>Main Comment</h1>
            {view}<br/>
                <Input value={this.state.username} id="username" placeholder="Username" style={{marginBottom: '10px'}} onChange={this.handleChange.bind(this)} />
                <Input value={this.state.message} id="message" placeholder="Message" onChange={this.handleChange.bind(this)} /><br/>
                <Button onClick={this.handleSubmit.bind(this)} primary>Send</Button>
            </div>
        )
    }
}