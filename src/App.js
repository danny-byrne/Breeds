import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      cache: {},
      breeds: [],
      imageURLs: []
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(res => res.json())
      .then(res => this.setState({ breeds: res.message }))
  }

  //method to handle change in input and update state
  handleChange(event) {
    this.setState({value: event.target.value});
    // console.log(this.state)
  }

  //method to take the value from state.searchbox and first search the cache, if not there, use the term to query the API
    //store results in the cache as well as displaying them.
  // handleSearch(){
  //   let value = this.state.value;


  //method to pull fetch image URLs and combine them with breeds data in state

  render() {
    //pull data from this.state.data and display as 
    console.log('inside the render, this.state.breeds is', typeof this.state.breeds, this.state.breeds)
    //destructure
    return (
      <div>
        <h1>Breeds</h1>
        <input type = "text" placeholder='enter breed' value = {this.state.value} onChange={this.handleChange} />
          <Breeds breeds={this.state.breeds}/>
      </div>
    );
  }
}

function Breeds(props){
    let breeds = { props };
    let list = Object.keys(breeds)
    let breedList = list.forEach(e => {
      return <li key={e}>{e}</li>
    });
    return (
      <ul>{breedList}</ul>
    );
}



export default App;
