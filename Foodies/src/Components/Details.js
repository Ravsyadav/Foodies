import { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import queryString from 'query-string';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Modal from 'react-modal';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-tabs/style/react-tabs.css';
import "../Styles/details.css";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid tomato',
        width: '550px'
    }
};

class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant: undefined,
            isMenuModalOpen: false,
            menu: [],
            totalPrice: 0
        };
    }

    componentDidMount() {
        // get the restaurant id from the query params
        const qs = queryString.parse(this.props.location.search);
        const { id } = qs;

        // make an API call to get the restaurant details for the given id
        axios.get(`http://localhost:5402/api/getRestaurantByID/${id}`)
            .then(result => {
                this.setState({
                    restaurant: result.data.restaurant[0]
                });
            })
            .catch(error => {
                console.log(error);
            });
        
        axios.get(`http://localhost:5402/api/getMenuByRestaurant/${id}`)
            .then(result => {
                this.setState({
                    menu: result.data.menu
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    openMenuHandler = () => {
        this.setState({
            isMenuModalOpen: true
        });
    }

    closeMenuHandler = () => {
        this.setState({
            isMenuModalOpen: false
        });
    }

    addItemHnadler = (item) => {
        const { totalPrice } = this.state;
        this.setState({
            totalPrice: totalPrice + item.itemPrice
        });
    }

    getCheckSum = (data) => {
        return fetch('http://localhost:5402/api/payment', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json();
        }).catch(error => {
            console.log(error);
        });
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    builfForm = (details) => {
        const { action, params } = details;

        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);

        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    }

    postTheInfo = (details) => {
        const form = this.builfForm(details);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    paymentHandler = () => {
        if (this.state.totalPrice == 0) {
            return;
        }
        const data = {
            amount: this.state.totalPrice,
            email: 'XXXXXXXX@gmail.com',
            mobileNo: '9999999999'
        };
        this.getCheckSum(data)
            .then(result => {
                let information = {
                    action: "https://securegw-stage.paytm.in/order/process", // URL of paytm server
                    params: result
                }
                this.postTheInfo(information);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const { restaurant, isMenuModalOpen, menu, totalPrice } = this.state;
        return (
            <div className="container py-5">
                {
                    restaurant
                    ?
                    <div>
                        <div className="images mt-5">
                        <Carousel dynamicHeight={false} showThumbs={false} infiniteLoop={true}>
                            <div>
                                <img src={require("../Assets/img2.jpg").default} alt="myimage" />
                            </div>
                            <div>
                                <img src={require("../Assets/img1.jpg").default} alt="myimage" />
                            </div>
                            <div>
                                <img src={require("../Assets/img3.jpg").default} alt="myimage" />
                            </div>
                            <div>
                                <img src={require("../Assets/image.png").default} alt="myimage" />
                            </div>
                        </Carousel>
                        </div>
                        <div className="restName mt-4 mb-3">
                            { restaurant.name }
                            <button className="btn btn-danger float-end" onClick={this.openMenuHandler}>Place Online Order</button>
                        </div>
                        <div className="mytabs">
                            <Tabs>
                                <TabList>
                                    <Tab>Overview</Tab>
                                    <Tab>Contact</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="container"> 
                                        <div className="about">About this place</div>
                                        <div className="cuisine">Cuisine</div>
                                        <div className="cuisines mt-1">
                                            {
                                                restaurant.cuisine.map((item, index) => {
                                                    return <span> { item.name }, </span>
                                                })
                                            }
                                        </div>
                                        <div className="cuisine mt-3">Average Cost</div>
                                        <div className="cuisines mt-1">
                                            &#8377; { restaurant.min_price } for two people (approx.)
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="container">
                                        <div className="cuisines my-3">
                                            Phone Number
                                            <div className="text-danger">
                                                { restaurant.contact_number }
                                            </div>
                                        </div>
                                        <div className="cuisine mt-5">{ restaurant.name }</div>
                                        <div className="text-muted">{ restaurant.locality }, { restaurant.city }</div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <Modal isOpen={isMenuModalOpen} style={customStyles}>
                            <h3 className="restName">{ restaurant.name }</h3>
                            <button onClick={this.closeMenuHandler} className="btn btn-light closeBtn">Close</button>
                            <ul className="menu">
                                {
                                    menu.map((item, index) => {
                                        return <li key={index}>
                                            <div className="row no-gutters menuItem">
                                                <div className="col-10">
                                                    {
                                                        item.isVeg 
                                                        ?
                                                        <div className="text-success">Veg</div> 
                                                        :
                                                        <div className="text-danger">Non-Veg</div> 
                                                    }
                                                    <div className="cuisines">{ item.itemName }</div>
                                                    <div className="cuisines">&#8377;{ item.itemPrice }</div>
                                                    <div className="cuisines item-desc text-muted">{ item.itemDescription }</div>
                                                </div>
                                                <div className="col-2">
                                                    <button className="btn btn-light addButton" onClick={() => this.addItemHnadler(item)}>Add</button>
                                                </div>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="mt-3 restName fs-4">
                                Subtotal  <span className="m-4">&#8377;{ totalPrice }</span>
                                <button className="btn btn-danger float-end" onClick={this.paymentHandler}>Pay Now</button>
                            </div>
                        </Modal>
                    </div>
                    :
                    <div className="text-dark m-5 p-5 fs-6">Loading...</div>
                }
            </div>
        );
    }
}

export default Details;