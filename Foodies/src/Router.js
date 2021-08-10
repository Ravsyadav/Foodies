import { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './Components/Home';
import Filter from './Components/Filter';
import Details from './Components/Details';
import Header from './Components/Header';

class Router extends Component {

    render () {
        return(
            <BrowserRouter>
                <Header/>
                <Route exact path="/" component={Home}  />
                <Route path="/home" component={Home}  />
                <Route path="/filter" component={Filter}  />
                <Route path="/details" component={Details} />
            </BrowserRouter>
        );
    }
}

export default Router;