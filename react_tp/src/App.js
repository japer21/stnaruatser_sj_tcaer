import React, { Component } from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      currentPage: 1,
      todosPerPage: 10,
      count:0,
      npages:0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.loadData(this.state.currentPage);
    this.getTotCount();
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id)
    });
    this.loadData(Number(event.target.id));
  }
  getTotCount(){
    let url = "http://localhost:8080/api/restaurants/count";
    fetch(url)
      .then(response => {
      return response.json();
    })
      .then(data => {
      this.setState({count:data.data, npages:Math.ceil(data.data/10)});
    }).catch(err => {
      console.log("erreur dans le get : " + err)
    });
  }
      
  loadData(n){
    let url="http://localhost:8080/api/restaurants?page="+n;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.setState({restaurants:data.data});
        }).catch(err => {
          console.log("erreur dans le get : " + err)
        });
  }

  render() {
    const { restaurants, currentPage, todosPerPage, count, npages } = this.state;
    const liStyle = {
        backgroundColor: 'lightpink'
    };
    let list =this.state.restaurants.map((resto, index) => {
      return <tr key={index} style={liStyle}><td>{resto.name}</td><td>{resto.cuisine}</td></tr>
    })

        // Logic for displaying page numbers
    const pageNumbers = [];
    var min;
      if(currentPage < 4) {
        min= 1;
      } else if ( currentPage > npages - 4) {
        min= npages-5;
      } else  {
        min= currentPage-2;
      }
      var max;
      if (npages < 16) {
              max= npages;
          } else if(currentPage < 14) {
              max= 16;
          } else if (currentPage > npages - 15) {
              max= npages;
          } else  {
              max= currentPage+13;
          }
    
    for (var i = min; i <max; i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      if(this.state.currentPage===number){
        return (
        <a className="active" href="#"
          key={number}
          id={number}
          onClick={this.handleClick}>
          {number}
        </a>
      );
      }
      else{
        return (
        <a href="#"
          key={number}
          id={number}
          onClick={this.handleClick}>
          {number}
        </a>
      );
      }
      
    });
    const liStyle1 = {
      backgroundColor: 'grey'
    };
    return (
      <div>
        <table>
        <thead>
          <tr style={liStyle1}>
            <td>
              <b>NOM</b>
            </td>
            <td>
              <b>CUISINE</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {list}
        </tbody>
      </table>
        <ul className="pagination" >
          {renderPageNumbers}
        </ul>
      </div>
    );
  }
}
export default App;