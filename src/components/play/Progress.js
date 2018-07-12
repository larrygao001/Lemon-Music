import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import "./progress.styl"

class Progress extends React.Component {
	componentDidUpdate() {
		if (!this.progressBarWidth) {
			this.progressBarWidth = ReactDOM.findDOMNode(this.refs.progressBar).offsetWidth;
		}
	}
	componentDidMount() {
		let progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar);
		let progressDOM = ReactDOM.findDOMNode(this.refs.progress);
		let progressBtnDOM = ReactDOM.findDOMNode(this.refs.progressBtn);
		this.progressBarWidth = progressBarDOM.offsetWidth;

		
		let {disableButton, disableDrag, onDragStart, onDrag, onDragEnd} = this.props;
		if (disableButton !== true && disableDrag !== true) {
			let downX = 0;
			let buttonLeft = 0;

			progressBtnDOM.addEventListener("touchstart", (e) => {
				let touch = e.touches[0];
				downX = touch.clientX;
				buttonLeft = parseInt(touch.target.style.left, 10);

				if (onDragStart) {
					onDragStart();
				}
			});
			progressBtnDOM.addEventListener("touchmove", (e) => {
				e.preventDefault();

				let touch = e.touches[0];
				let diffX = touch.clientX - downX;
				
				let btnLeft = buttonLeft + diffX;
				if (btnLeft > progressBarDOM.offsetWidth) {
					btnLeft = progressBarDOM.offsetWidth;
				} else if (btnLeft < 0) {
					btnLeft = 0;
				}
				//Set left value
				touch.target.style.left = btnLeft + "px";
				//Set width value
				progressDOM.style.width = btnLeft / this.progressBarWidth * 100 + "%";

				if (onDrag) {
					onDrag(btnLeft / this.progressBarWidth);
				}
			});
			progressBtnDOM.addEventListener("touchend", (e) => {
				if (onDragEnd) {
					onDragEnd();
				}
			});
		}
	}
	render() {
		//progress range: 0-1
		let {progress, disableButton}  = this.props;
		if (!progress) progress = 0;

		//left value
		let progressButtonOffsetLeft = 0;
		if(this.progressBarWidth){
			progressButtonOffsetLeft = progress * this.progressBarWidth;
		}

		return (
			<div className="progress-bar" ref="progressBar">
				<div className="progress-load"></div>
				<div className="progress" style={{width:`${progress * 100}%`}} ref="progress"></div>
				{
					disableButton === true ? "" : 
					<div className="progress-button" style={{left:progressButtonOffsetLeft}} ref="progressBtn"></div>
				}
			</div>
		);
	}
}

Progress.propTypes = {
	progress: PropTypes.number.isRequired,
	disableButton: PropTypes.bool,
	disableDrag: PropTypes.bool,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragEnd: PropTypes.func
};

export default Progress