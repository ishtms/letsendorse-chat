import React from 'react';
import {Message} from 'semantic-ui-react';
import { Input, Button } from 'semantic-ui-react'
import axios from 'axios';

export default class SecondChild extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            message: '',
            username: ''
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
        if(this.state.message.length < 5 || this.state.username.length < 5){
            alert("Input field must be over 5 characters long");
            return;
        }
        axios
            .post('/addSecondChild', {
                parentId: this.props.match.params.id,
                childId: this.props.match.params.childId,
                lastUsername: this.state.username,
                lastMessage: this.state.message
            }).then(() => {
                let StateObject = Object.assign({}, this.state);
                let crntParent;
                StateObject.data.map((curr) => {
                    if(curr.commentID === this.props.match.params.id){
                        crntParent = curr;
                    }
                })
                let crntChild;
                crntParent.directComment.map((current) => {
                    if(current.id === this.props.match.params.childId){
                        crntChild = current;
                    }
                })
                crntChild.childComments.push({username: this.state.username, message: this.state.message});

                StateObject.username = '';
                StateObject.message = '';
                this.setState(StateObject);
            }).catch((err) => {
                console.log(err);
            })
    }
    render(){
        let parent, child, returnObj;
        this.state.data.map((prop) => {
            if(prop.commentID === this.props.match.params.id){
                parent = prop.directComment
            }
        });
        if(parent){
            parent.map((current) => {
                if(current.id === this.props.match.params.childId){
                    child = current
                }
            })
        returnObj = child.childComments.map((curr,key)=>{
                return (<Message
                            key={key}
                            icon="inbox"
                            header={curr.username}
                            content={curr.message}
                        />);
            })
        }
        
        return <div><h1>Third child</h1>
                    {child ? returnObj: ''}<br/>
                    <Input value={this.state.username} id="username" placeholder="Username" style={{marginBottom: '10px'}} onChange={this.handleChange.bind(this)} />
                    <Input value={this.state.message} id="message" placeholder="Message" onChange={this.handleChange.bind(this)} /><br/>
                    <Button onClick={this.handleSubmit.bind(this)} primary>Send</Button>
                </div>
    }
}