import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import LocationPicker from 'react-location-picker';
import ImageUploader from 'react-images-upload';
import ReactTags from 'react-tag-autocomplete';
import { Redirect } from 'react-router-dom';

class CreatePost extends Component {

    constructor( props ) {
        super();
        
        /* Bindings */
        this.createPostHandler = this.createPostHandler.bind(this);
        this.createPostTypeComponentHandler = this.createPostTypeComponentHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.dateTimeChangeHandler = this.dateTimeChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.imageChangeHandler = this.imageChangeHandler.bind(this);
        this.choiceAddHandler = this.choiceAddHandler.bind(this);
        this.choiceDeleteHandler = this.choiceDeleteHandler.bind(this);
        this.redirectToCommunityHome = this.redirectToCommunityHome.bind(this);
        
        /* State */
        this.state = {
          
          postType : props.location.props.postType,
          community : props.location.props.community,
          form: {
              post : {
                      communityId : props.location.props.community.id,
                      postTypeId : props.location.props.postType.id,
                      fieldValueMap :  {}
                      }
                },
          pictures: [],
          result : '',
          showCommunityHome : false,
          selectedDate : new Date()
        }
      }

    // To save post
    createPostHandler = event => {
      event.preventDefault();
      const a = this.state.form;
      console.log(a);

      const postData = this.state.form;
      console.log(this.state.selectedDate);
  
      const url = "/savePost"
  
      fetch(url, {  method: "POST", 
                    body: JSON.stringify(postData), 
                    headers:{ "Content-Type": "application/json" } 
                  })
                  .then( response => response.json())
                  .then( this.redirectToCommunityHome());
      // result.response buradaki response response objelerinin içerisindeki attribute name  
      
      var message = `Community is created successfully.` ;
  
      console.log(message);
      this.setState( { result: message , showMessage : true }) ;

    }


    redirectToCommunityHome (){
      this.setState({
        ...this.state,
        showCommunityHome : true
      })
    }
  
    imageChangeHandler(picture) {
      this.setState({
          pictures: this.state.pictures.concat(picture),
      });
    }

 

  /*-------------------------------*/
  /* Input Handlers                */
  /*-------------------------------*/

  inputChangeHandler = event => {
    // event.target returns the <input/> component 
    // you should merge state !!!!
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      form : {
        ...this.state.form,
        post : {
          ...this.state.form.post,
          fieldValueMap : {
            ...this.state.form.post.fieldValueMap,
            [name]: value,
          }
        }
      },
      result : ''
    });
  }
 
  dateTimeChangeHandler = (name, value) => {
    this.setState({
      form : {
        ...this.state.form,
        post : {
          ...this.state.form.post,
          fieldValueMap : {
            ...this.state.form.post.fieldValueMap,
            [name]: value,
          }
        }
      },
      result : ''
    });
  }

  locationChangeHandler = event => {
    
  }

  imageChangeHandler = event => {
    
  }
  
  choiceDeleteHandler = event => {
    
  }

  choiceAddHandler = event => {
    
  }



  createPostTypeComponentHandler(field) {

    let type = field.fieldType; 
    let key = field.fieldKey;   
    /*--------------------------------------------*/
    /* Constant values for components             */
    /*--------------------------------------------*/
    const selectedDate = new Date();
    const defaultPosition = {
      lat: 27.9878,
      lng: 86.9250
    };

    /*-------------------------------------------*/
    /* Return different components based on type */
    /*-------------------------------------------*/
    switch(type) {
      case 'TEXT':
        return <Input id = {key} type = "text" 
                      name = {key}  
                      value = {this.state.form.post.fieldValueMap[key]} 
                      onChange = {this.inputChangeHandler}></Input>;
      case 'NUMBER':
        return <Input id = {key} type = "number" 
                      name = {key} 
                      value = {this.state.form.post.fieldValueMap[key]}
                      onChange = {this.inputChangeHandler}></Input>;
      case 'DECIMAL':
        return <Input id = {key} type = "number" 
                      name = {key} 
                      value = {this.state.form.post.fieldValueMap[key]}
                      onChange = {this.inputChangeHandler}></Input>;
      case 'DATETIME':
        return  <DatePicker id = {key}
                            name = {key}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat = "dd/MM/yyyy HH:mm"
                            selected = {this.state.form.post.fieldValueMap[key]}
                            onChange = {this.dateTimeChangeHandler.bind(this, key)}
                          />;
      case 'LOCATION':
        return <LocationPicker  id = {key}
                          name = {key}
                          containerElement={ <div style={ {height: '100%'} } /> }
                          mapElement={ <div style={ {height: '400px'} } /> }
                          defaultPosition={defaultPosition}
                          onChange={this.locationChangeHandler}
                      />;
      case 'URI':
        return <Input id = {key} type = "text" 
                          name = {key} 
                          value = {this.state.form.post.fieldValueMap[key]}
                          onChange = {this.inputChangeHandler}></Input>;
      case 'IMAGE':
        return <ImageUploader id = {key}
                          name = {key}
                          withIcon={true}
                          buttonText='Choose images'
                          onChange={this.imageChangeHandler}
                          imgExtension={['.jpg', '.gif', '.png', '.gif']}
                          maxFileSize={5242880}
                      />;
      case 'CHOICE':
        let optionList = field.choiceFieldSet;
        return  <Input type="select" name={key}  id={key} onChange = {this.inputChangeHandler} >
                  {
                    optionList.map((idx,val) => ( <option value = {this.state.form.post.fieldValueMap[key]} >{field.choiceFieldSet[val]}</option>))
                  }
                  </Input>;
      default:
        return null;
    }
  }

 
  render(){

    let postType = this.state.postType;
    let postFieldSet = this.state.postType.postFieldSet;

    let communityHome = '';
    let createPostForm = '';

    
    if(this.state.showCommunityHome)
      communityHome = (<Redirect to={{  pathname : "/communityHome",
                                            props : {
                                              community : this.state.community
                                            }
                                          }}/>); 
    else
      createPostForm = ( <Form onSubmit =  {this.createPostHandler}>
                                <FormGroup row>
                                  <Label  sm={6} size="lg">{postType.name}</Label>
                                  <Label  sm={6} size="md">{postType.explanation}</Label>
                                </FormGroup>

                                {
                                    postFieldSet.map((val, idx) =>  (
                                      <FormGroup row key={idx}>
                                        <Label sm={4} size="md"> {postFieldSet[idx].fieldLabel} </Label>
                                        <Col sm={8}>
                                          {this.createPostTypeComponentHandler(postFieldSet[idx])}
                                        </Col>
                                      </FormGroup>
                                    ))  
                                }
                                <Button color = "success" >Create Post</Button>  
                              </Form>
                        
                            ); 

    return ( this.state.showCommunityHome ? communityHome : createPostForm);

  }
}
export default CreatePost;






