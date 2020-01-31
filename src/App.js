import React, { Component } from 'react';
import classes from './App.module.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      breeds: [],
      imageURLs: {},
      clicked: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.pairImageRefs = this.pairImageRefs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUnclick = this.handleUnclick.bind(this);
    this.fetchDoggies = this.fetchDoggies.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
  }
  

  //if localStorage doesn't have state, 
  componentDidMount() {
    console.log('in componentDidMount, state is', this.state,'checking local storage')
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
      let { breeds, imageUrls } = JSON.parse(localStorage.getItem('state')) 
      this.setState({ breeds: breeds, imageUrls: imageUrls })
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
  }

  handleUnclick(){
    console.log('unclicked')
    this.setState({ clicked: false });
  }


  //when the user want to search a breed
  handleClick(e){
    let { breeds, value } = this.state;
    if(!breeds.includes(value)) {
      alert('Doggy Not Found');
    }
    if(!this.state.imageURLs[value]){ 
      this.pairImageRefs()
        .then(() => this.setState({clicked: true}))
    } else {
      this.setState({ clicked: true })
    } 
  }

  async pairImageRefs() {
    let breed = this.state.value;
    fetch(`https://dog.ceo/api/breed/${breed}/images`)
      .then(res => res.json())
      .then(res => {
        let urls = this.state.imageURLs;
        urls[breed] = res.message;
        this.setState({ imageURLs: urls });
        console.log('updated image cache', this.state)
        this.setState({clicked: true});
        localStorage.setItem('state', JSON.stringify(this.state))
      })
      .catch(err => console.log('there was an error fetching images, check input', err))
      .then(() => this.handleUnclick)
  }
 
  render() {
    // let divStyle = {
    //   alignContent: 'flex'
    // }
    let content = null;

    if(this.state.clicked){
      content = <Breed breed={this.state.value} urls={this.state.imageURLs[this.state.value]} />
    }
  
    return (
      <div className={classes.body} >
        <h1 className={classes.text}>Breeds</h1>
        <input className={classes.input} type = "text" placeholder='enter breed' value={this.state.value} onChange={this.handleChange} onClick={this.handleUnclick}/>
        <button className={classes.button} onClick={this.handleClick}> Click to Search </button>
        {content}
      </div>
    );
  }
}

function Breed(props){

  let { breed , urls } = props;
  let i = 0;
  let images = null;
  if(urls){ 
    images = urls.map((e) => {
      return ( <img className={classes.pictures} key={++i} src={e} alt=''/> )
    });
  }

  return (
    <>
      <h1 style={classes.h1}>{breed}</h1>
      {images} 
    </>
  );
}

export default App;
