import { Component } from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearch extends Component {

    handleClick(id, heading) {
        const url = `/filter?mealtype=${id}&mealTypeName=${heading}`;
        this.props.history.push(url);
    }

    render() {
        const  { imageSrc, heading, content, mealTypeId } = this.props;
        return (
            <>
                <div className="col-12 col-md-6 col-lg-4" onClick={() => this.handleClick(mealTypeId, heading)}>  
                    <div className="quickSearchBox">
                        <img src={imageSrc} width="160" height="160" alt="myimg" />
                        <div className="quickSearchDesc">
                            <h3>{heading}</h3>
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(QuickSearch);