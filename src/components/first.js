import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Message } from 'semantic-ui-react';
import axios from 'axios';

export default class FirstChild extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            username: '',
            message: ''
        }
    }
    handleChange(e){
        const StateObject = Object.assign({}, this.state);
        StateObject[e.target.id] = e.target.value;
        this.setState(StateObject);
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
    handleSubmit(){
        if(this.state.message.length < 5 || this.state.username.length < 5){
            alert("Input field must be over 5 characters long");
            return;
        }
        let __id = Date.now().toString();
        axios
            .post('/addFirstChild', {
                parentId: this.props.match.params.id,
                username: this.state.username,
                message: this.state.message,
                id: __id
            }).then(() => {
                let StateObject = Object.assign({}, this.state);
                var current;
                StateObject.data.map((curr) => {
                    if(curr.commentID === this.props.match.params.id){
                        current = curr;
                    }
                })
                current.directComment.push({username: this.state.username, message: this.state.message, id: __id});
                current.id = __id;
                StateObject.username = '';
                StateObject.message = '';
                this.setState(StateObject);
            }).catch(err=>{
                console.log(err)
            })
    }
    render(){
        let mainChatObj;
         this.state.data.map((prop)=>{
             if(prop.commentID === this.props.match.params.id){
                 mainChatObj = prop.directComment;
             }
        })
        let returnableObj;
        if(mainChatObj){
            returnableObj = mainChatObj.map((curr, key)=>{
            return (<Link key={key} to={`/view/${this.props.match.params.id}/${curr.id}`}>
                        <Message
                            icon="inbox"
                            header={curr.username}
                            content={curr.message}
                        />
                    </Link>);
        })
        }
        
        return <div><h1>2nd Child</h1>{mainChatObj ? returnableObj : ''}<br/>
                    <Input value={this.state.username} id="username" placeholder="Username" style={{marginBottom: '10px'}} onChange={this.handleChange.bind(this)} />
                    <Input value={this.state.message} id="message" placeholder="Message" onChange={this.handleChange.bind(this)} /><br/>
                    <Button onClick={this.handleSubmit.bind(this)} primary>Send</Button>
                </div>
    }
}