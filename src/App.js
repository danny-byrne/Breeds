import React, { Component } from 'react';
import classes from './App.module.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      breeds: [],
      images: {},
      clicked: false,
      toDisplay: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.pairImageRefs = this.pairImageRefs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUnclick = this.handleUnclick.bind(this);
    this.fetchDoggies = this.fetchDoggies.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.getMeDoggies = this.getMeDoggies.bind(this);
    this.updateToDisplay = this.updateToDisplay.bind(this);
  }
  

  //if localStorage doesn't have state, 
  componentDidMount() {
    console.log('in componentDidMount, state is ', this.state,'checking local storage')
    // this.fetchDoggies();
    //if local storage does not have state, they are at the beginning of their session and we should fetch the doggies
    if(localStorage.getItem('state') === null ) {
      console.log('local storage is empty, we\'re at the beginning of the session, lets fetch some doggie names')
      this.fetchDoggies();
      this.updateLocalStorage();
    } else {
      console.log('localStorage found, ')
        this.getInitialStorage();
    }
  }


  async fetchDoggies() {
    console.log('fetching')
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(res => res.json())
      .then(res => this.setState({ breeds: Object.keys(res.message) }))
      .then(() => console.log('inside fetchDoggies, this.state.breeds is', this.state.breeds))
  }

  updateLocalStorage(e) {
    localStorage.setItem('state', e ? JSON.stringify(e) : JSON.stringify(this.state))
  }

  getInitialStorage () {
    let { breeds, images } = JSON.parse(localStorage.getItem('state')) 
    this.setState({ breeds: breeds, images: images })
  }

  getLocalStorage () {
    this.setState({...JSON.parse(localStorage.getItem('state')) })
  }  

  componentWillUpdate(nextProps, nextState) {
    this.updateLocalStorage(nextState)
  }

  //method to handle change in input 
  handleChange(event) {
    this.setState({value: event.target.value});
    this.updateLocalStorage();
  }

  handleUnclick(){
    console.log('unclicked')
    this.setState({ clicked: false });
  }

  updateToDisplay(input){
    input.forEach((breed) => {
      if(!this.state.toDisplay[breed]){
        let { toDisplay } = this.state;
        toDisplay[breed] = this.state.images[breed].slice(0,5)
        this.setState({ toDisplay });
      }
    })

    this.state.toDisplay.forEach((e) => {
      if(!input.includes(e)){
        let { toDisplay } = this.state;
        delete toDisplay[e];
        this.setState({ toDisplay });
      } 
    })
  }

  // when the user want to search a breed
  handleClick(e){
    console.log('clicked');
    let doggies = this.state.value.split(',').map(e => e.trim().toLowerCase());
    let foundDoggies = [];
    doggies.forEach((breed) => {
      if(!this.state.breeds.includes(breed)){
        return Error;
      }
      if(this.state.breeds.includes(breed) && !this.state.images[breed]){
        this.pairImageRefs(breed);
        foundDoggies.push(breed);
      }
      if(this.state.breeds.includes(breed) && this.state.images[breed] && foundDoggies.push(breed));
    })
    this.updateToDisplay(foundDoggies)
  }
  
  getMeDoggies(){
    
  }

  async pairImageRefs(breed) {
    // let breed = this.state.value;
    fetch(`https://dog.ceo/api/breed/${breed}/images`)
      .then(res => res.json())
      .then(res => {
        let urls = this.state.images;
        urls[breed] = res.message;
        this.setState({ images: urls });
        console.log('updated image cache', this.state)
        // this.setState({clicked: true});
        this.updateLocalStorage();
      })
      .catch(err => console.log('there was an error fetching images, check input', err))
      .then(() => this.handleUnclick)
  }

  
 
  render() {
    let urDoggies = null;
    // if(Object.keys(this.state.toDisplay).length)


    if(this.state.clicked){
      let doggies = this.state.value.split(',').map(e => e.trim().toLowerCase());
      urDoggies = doggies.forEach((e) => {
        if(this.state.breeds.includes(e) && this.state.images[e]){
          console.log(`creating a breed component with ${e}`)
          return <Breed images={this.state.images[e].slice(0,5)} breed={e} />
        } else if (this.state.breeds.includes(e) && !this.state.images[e]){
          this.pairImageRefs(e);
          return ( <Breed images={this.state.images[e].slice(0,5)} breed={e} />)
        } else {
          return (<h1>{`${e} is not a valid doggo breed, try again`}</h1>)
        }
      })
    }    

    return (
      <div className={classes.body} >
        <h1 className={classes.text}>Breeds</h1>
        <input className={classes.input} type = "text" placeholder='enter breed' value={this.state.value} onChange={this.handleChange} onClick={this.handleUnclick}/>
        <button className={classes.button} onClick={this.handleClick}> Click to Search </button>
        {urDoggies}
      </div>
    );
  }
}

function Breed (props){
    console.log('inside the breed component', props.breed, props.images)
  let { breed , images } = props;
  let i = 0;
  let gallery = null;
  if(images){ 
    gallery = images.map((e) => {
      return ( <img className={classes.pictures} key={++i} src={e} alt=''/> )
    });
  }

  return (
    <>
      <h1 style={classes.h1}>{breed}</h1>
      {gallery} 
    </>
  );
}

export default App;
