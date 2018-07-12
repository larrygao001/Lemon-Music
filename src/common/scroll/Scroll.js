import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import "./scroll.styl"

class Scroll extends React.Component {
	componentDidUpdate() {
		if (this.bScroll && this.props.refresh === true) {
			this.bScroll.refresh();
		}
	}
	componentDidMount() {
		this.scrollView = ReactDOM.findDOMNode(this.refs.scrollView);
		if (!this.bScroll) {
			this.bScroll = new BScroll(this.scrollView, {
				scrollX: this.props.direction === "horizontal",
				scrollY: this.props.direction === "vertical",
				//dispatch scroll events
				probeType: 3,
				click: this.props.click
			});
			
			if (this.props.onScroll) {
				this.bScroll.on("scroll", (scroll) => {
					this.props.onScroll(scroll);
				});
			}
			
		}
	}
	componentWillUnmount() {
		this.bScroll.off("scroll");
		this.bScroll = null;
	}
	refresh() {
		if (this.bScroll) {
			this.bScroll.refresh();
		}
	}
	render() {
		return (
			<div className="scroll-view" ref="scrollView">
				{/*get child component*/}
				{this.props.children}
			</div>
		);
	}
}

Scroll.defaultProps = {
	direction: "vertical",
	click: true,
	refresh: false,
	onScroll: null
};

Scroll.propTypes = {
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
	//enable click?
	click: PropTypes.bool,
	//refresh?
	refresh: PropTypes.bool,
	onScroll: PropTypes.func
};

export default Scroll