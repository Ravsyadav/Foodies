import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import '../Styles/filter.css';

class Filter extends Component {

    constructor() {
        super();
        this.state = {
            locations: [],
            locationsInCity: [],
            selectedCityName: '',
            mealtypeId: 0,
            mealTypeName: '',
            restaurantList: [],
            selectedLocation: 0,
            cuisines: [],
            hCost: undefined,
            lCost: undefined,
            sortOrder: 1,
            pageNo: 1,
            totalResults: 0,
            pageSize: 2,
            noOFPages: 0
        };
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const  { mealtype, mealTypeName } = qs;
        this.setState({
            mealtypeId: mealtype,
            mealTypeName: mealTypeName
        });
        const city_id = localStorage.getItem("city_id");
        axios.get('http://localhost:5402/api/getLocations')
            .then(result => {
                const locations = result.data.locations;
                const selectedCity = locations.find(city => city.city_id == city_id);
                const cityLocations = locations.filter(city => city.city_id == city_id);
                this.setState({
                    locations: result.data.locations,
                    selectedCityName: selectedCity.city,
                    locationsInCity: cityLocations,
                    selectedLocation: cityLocations[0].location_id
                });
                setTimeout(() => {
                    this.filterRestaurants();
                }, 0);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleLocationChange(e) {
        const location_id = e.target.value;
        this.setState({
            selectedLocation: location_id
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCuisineChange(event, cuisine) {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);

        if (index < 0 && event.target.checked) {
            cuisines.push(cuisine);
        } else if (event.target.checked) {
            cuisines.slice(index, 1);
        }

        this.setState({
            cuisines: cuisines
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCostChange(event, lowCost, highCost) {
        this.setState({
            hCost: highCost,
            lCost: lowCost
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleSort(e, sortDir) {
        this.setState({
            sortOrder: sortDir
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handlePage(pageNo) {
        if (pageNo < 1) return;
        this.setState({
            pageNo: pageNo
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    filterRestaurants() {
        const { mealtypeId, selectedLocation, cuisines, hCost, lCost, sortOrder, pageNo } = this.state;

        const req = {
            mealtype: mealtypeId,
            page: pageNo
        };
        if (selectedLocation) {
            req.location = selectedLocation;
        }
        if (cuisines.length > 0) {
            req.cuisine = cuisines;
        }
        if (hCost != undefined && lCost != undefined) {
            req.hcost = hCost;
            req.lcost = lCost;
        }
        if (sortOrder != undefined) {
            req.sort = sortOrder;
        }
        axios({
            method: 'POST',
            url: 'http://localhost:5402/api/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const totalResults = result.data.totalResultsCount;
            const pageSize = result.data.pageSize;
            
            let quotient = totalResults / pageSize;
            quotient = Math.floor(quotient);
            let noOFPages = quotient;

            const remainder = totalResults % pageSize;
            if (remainder > 0) {
                noOFPages = quotient + 1;
            }
            this.setState({
                restaurantList: result.data.restaurants,
                pageNo: result.data.pageNo,
                totalResults: result.data.totalResultsCount,
                noOFPages: noOFPages
            });
        }).catch(error => {
            console.log(error);
        });
    }

    getPages = () => {
        const { noOFPages } = this.state;
        let pages = [];
        for (let i = 0; i < noOFPages; i++ ) {
            pages.push(<span key={i} onClick={() => this.handlePage(i+1)} className="paginationButton">{ i+ 1 }</span>)
        }
        return pages;
    }

    goToDetails(item) {
        const url = `/details?id=${item._id}`;
        this.props.history.push(url);
    }

    render() {
        const { locations, selectedCityName, mealTypeName, locationsInCity, restaurantList, pageNo } = this.state;
        let currPage = pageNo;
        return (
            <>
                <div className="container pt-5">
                    <div className="row heading mt-4">
                        { mealTypeName } Places in { selectedCityName }
                    </div>
                    <div className="row">
                        <div className="col-3 filterSection">
                            <div className="sectionHeading">Filters</div>
                            <div className="sectionSubHeading">Select Location</div>
                            <select className="locationSelection" onChange={(e) => this.handleLocationChange(e)}>
                                {
                                    locationsInCity.map((item, index) => {
                                        return <option key={index} value={item.location_id}>{ item.name }</option>
                                    })
                                }
                            </select>
                            <div className="sectionSubHeading">Cuisine</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'North Indian')} /> North Indian</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'South Indian')} /> South Indian</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Chinese')} /> Chinese</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Fast Food')} /> Fast Food</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Street Food')}/> Street Food</div>
                            <div className="sectionSubHeading">Cost for two</div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 0, 500)} /> Less than &#8377; 500 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 500, 1000)} /> &#8377; 500 to &#8377; 1000 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1000, 1500)} /> &#8377; 1000 to &#8377; 1500 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1500, 2000)} /> &#8377; 1500 to &#8377; 2000 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 2000, 100000)} /> &#8377; 2000+ </div>
                            <div className="sectionSubHeading">Sort</div>
                            <div className="cuisineSelection"><input type="radio" name="sort" onChange={(e) => this.handleSort(e, 1)} /> Price low to high </div>
                            <div className="cuisineSelection"><input type="radio" name="sort" onChange={(e) => this.handleSort(e, -1)} /> Price high to low </div>
                        </div>
                        <div className="col-8 resultSection">
                            {
                                restaurantList.length > 0 
                                ?
                                    restaurantList.map((item, index) => {
                                        return <div key={index} className="row resultBox" onClick={() => this.goToDetails(item)}>
                                                    <div className="topSection row">
                                                        <div className="col-3">
                                                            <img className="resultImage" src={require('../' + item.image).default} alt="myimg"/>
                                                        </div>
                                                        <div className="col-9">
                                                            <div className="resultHeader">{item.name}</div>
                                                            <div className="resultSubHeader">{item.locality}</div>
                                                            <div className="resultDescription">{item.city}</div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="bottomSection row">
                                                        <div className="col-3">
                                                            <div className="resultdetils">
                                                                CUISINES:
                                                            </div>
                                                            <div className="resultdetils">
                                                                COST FOR TWO:
                                                            </div>
                                                        </div>
                                                        <div className="col-9">
                                                            <div className="resultdetilsOptions">
                                                                {
                                                                    item.Cuisine.map((c,i) => {
                                                                        return `${c.name}, `
                                                                    })
                                                                }
                                                            </div>
                                                            <div className="resultdetilsOptions">
                                                                &#8377; { item.min_price }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    })
                                :
                                    <div className="text-danger text-center my-5">No Restaurants found !</div>
                            }
                            {
                                restaurantList.length > 0 
                                ?
                                    <div className="paginationOptions">
                                        <span className="paginationButton" onClick={() => this.handlePage(--currPage)}>&#8592;</span>
                                        {
                                            this.getPages()
                                        }
                                        <span className="paginationButton" onClick={() => this.handlePage(++currPage)}>&#8594;</span>
                                    </div>
                                :
                                <div></div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(Filter);