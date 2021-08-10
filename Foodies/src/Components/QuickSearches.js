import { Component } from 'react';
import QuickSearch from './QuickSearch';
class QuickSearches extends Component {
    render() {
        const  { quicksearches } = this.props;
        return(
            <>
                 <div className="container mb-5">
                    <div className="quickSearchOptions">
                        <h1 className="quickSearchHeader row">Quick Search</h1>
                        <h4 className="quickSearchSubHeader row">Discover restaurants by type of meal</h4>
                    </div>
                    <div className="row">
                        {
                            quicksearches.map((item, index) => {
                                return <QuickSearch key={index} imageSrc={require('../' + item.image).default} heading={item.name} mealTypeId={item.meal_type} content={item.content}/>
                            })
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default QuickSearches;