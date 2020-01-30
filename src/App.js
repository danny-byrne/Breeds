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
  }

  //first get the list of breeds for us to check users input against before we make image fetch
  componentDidMount() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(res => res.json())
      .then(res => this.setState({ breeds: res.message })
      )
  }

  //method to handle change in input 
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  //when the user want to search a breed
  handleClick(e){
    let { breeds, value } = this.state;
    breeds = Object.keys(breeds)
    // console.log('in handleClick breeds is', breeds)
    //if breeds doesn't include this.state.value, throw an error
    if(!breeds.includes(value)) alert('Doggy Not Found');
    //if value not cached, pairImageURLs
    if(!this.state.imageURLs[value]){ 
      this.pairImageRefs();
    } 
    this.setState({clicked: true});  
  }

  pairImageRefs() {
    let breed = this.state.value;
    if(!this.state.imageURLs[breed]) {
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
    }
  }
 
  render() {
    let content = null;
    if(this.state.clicked){
      content = <Breed breed={this.state.value} urls={this.state.imageURLs[this.state.value]} />
    }
  
    return (
      <div>
        <h1>Breeds</h1>
        <input type = "text" placeholder='enter breed' value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleClick}> Woof!</button>
        {content}
      </div>
    );
  }
}

function Breed(props){
  let { breed , urls } = props;
  console.log('in Breed comoonent, urls is', urls, Array.isArray(urls))
  urls = [urls];
  let i = 0;
  console.log('in breed component render', urls)
  // build pictures out from urls
  let images = urls.map((e) => {
    console.log(`e is`, e)
      return ( <img key={++i} src={e} alt=''/> )
    }
  );
  return (
    <>
      {breed}
      {images} 
    </>
  );
}




export default App;
