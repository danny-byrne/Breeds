import React, { Component } from 'react';

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
  }

  //first get the list of breeds for us to check users input against before we make image fetch
  componentDidMount() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(res => res.json())
      .then(res => this.setState({ breeds: res.message }))
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
    breeds = Object.keys(breeds)
    if(!breeds.includes(value)) alert('Doggy Not Found');
    if(!this.state.imageURLs[value]){ 
      this.pairImageRefs()
        .then(() => this.setState({clicked: true}))
    } else {
      this.setState({clicked: true})
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
      })
      .catch(err => console.log('there was an error fetching images, check input', err))
      .then(() => this.handleUnclick)
  }
 
  render() {
    let divStyle = {
      alignContent: 'flex'
    }

    let content = null;
    if(this.state.clicked){
      content = <Breed breed={this.state.value} urls={this.state.imageURLs[this.state.value]} />
    }
  
    return (
      <div style ={divStyle} >
        <h1>Breeds</h1>
        <input type = "text" placeholder='enter breed' value={this.state.value} onChange={this.handleChange} onClick={this.handleUnclick}/>
        <button onClick={this.handleClick}> Woof!</button>
        {content}
      </div>
    );
  }
}

function Breed(props){
  let breedStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    width: "70%"
  }

  let { breed , urls } = props;
  console.log('Breed, props.urls is', urls, 'array check:', Array.isArray(urls))
  let i = 0;
  // build pictures out from urls
  let images = null;
  if(urls){
    images = urls.map((e) => {
        return ( <img style={breedStyle} key={++i} src={e} alt=''/> )
      }
    );
  }
  return (
    <>
      {breed}
      {images} 
    </>
  );
}




export default App;
