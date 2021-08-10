
import { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../Styles/wallpaper.css';

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            text: '',
            restaurants: [],
            suggestions: []
        };
    }

    onOptionsChange(event) {
        const city_id_city_name = event.target.value;
        const city_id = city_id_city_name.split('_')[0];
        const cityName = city_id_city_name.split('_')[1];
        localStorage.setItem("city_id", city_id);

        // fetch the restaurants for the location  selected by the user
        axios.get(`http://localhost:5402/api/getRestaurantByLocation/${cityName}`)
            .then(result => {
                this.setState({
                    restaurants: result.data.restaurants
                });
            }).catch(error => {
                console.log(error);
            });
    }

    onTextChanged = (event) => {
        const searchtext = event.target.value;
        const  { restaurants } = this.state;
        let suggestions = [];

        if (searchtext.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(searchtext.toLowerCase()))
        }

        this.setState({
            text: searchtext,
            suggestions: suggestions
        });
    }

    goToRestaurant = (item) => {
        this.props.history.push(`/details?id${item._id}`);
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length == 0) {
            return null;
        }
        return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} onClick={() => this.goToRestaurant(item)}>
                                <div className="suggestionImage">
                                    <img src={require('../' + item.image).default} alt="myimg"/>
                                </div>
                                <div className="suggestionText w-100">
                                    <div>
                                        {item.name}, {item.locality}
                                    </div>
                                    <div className="text-muted">
                                        Rating: {item.aggregate_rating}
                                        <span className="text-danger float-end">
                                            Order Now >
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }

    render() {
        const { cities } = this.props;
        return (
            <>
                <img src={require('../Assets/homepageimg.png').default} className="homeImage" alt="homeimage" />
                <div className="imageText">
                    <div className="logo">
                        <img src={require('../Assets/logo1.png').default} className="homelogo" alt="image not found"/>
                    </div>
                    <div className="headerText">
                        Find the best restaurants, cafés, and bars
                    </div>
                </div>
                <div className="locationOptions row">
                    <div className="col-12 col-md-5 location-wrapper text-md-end text-center">
                        <select className="locationDropDown" onChange={(event) => this.onOptionsChange(event)}>
                            <option value="0" disabled selected>Select Location</option>
                            {
                                cities.map((item, index) => {
                                    return <option key={index} value={item.city_id + '_' + item.city}>{item.name}, {item.city}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-md-7 search-wrapper text-md-start text-center">
                        <input className="restaurantSearch" type="text" placeholder="Search the Restaurants" onChange={this.onTextChanged}/>
                        {
                            this.renderSuggestions()
                        }
                    </div>  
                </div>
            </>
        );
    }
}

export default withRouter(Wallpaper);