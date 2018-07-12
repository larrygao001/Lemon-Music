import React from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import Progress from "./Progress"
import MiniPlayer from "./MiniPlayer"
import {Song} from "@/model/song"

import "./player.styl"

class Player extends React.Component {
	constructor(props) {
		super(props);


		this.currentSong = new Song(0, "", "", "", 0, "", "");
		this.currentIndex = 0;
		this.dragProgress = 0;
		this.playModes = ["list", "single", "shuffle"];

		this.state = {
			currentTime: 0,
			playProgress: 0,
			playStatus: false,
			currentPlayMode: 0
		}
	}
	componentDidMount() {
		this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
		this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
		this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
		this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);

		this.audioDOM.addEventListener("canplay", () => {
				this.audioDOM.play();
				this.startImgRotate();

				this.setState({
					playStatus: true
				});
			
		}, false);

		this.audioDOM.addEventListener("timeupdate", () => {
			if (this.state.playStatus === true) {
				this.setState({
					playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
					currentTime: this.audioDOM.currentTime
				});
			}
		}, false);

		this.audioDOM.addEventListener("ended", () => {
			if (this.props.playSongs.length > 1) {
				let currentIndex = this.currentIndex;
				if (this.state.currentPlayMode === 0) {  //Play all songs in the list
					if(currentIndex === this.props.playSongs.length - 1){
						currentIndex = 0;
					}else{
						currentIndex = currentIndex + 1;
					}
				} else if (this.state.currentPlayMode === 1) {  //repeat current song
					//continue to play current song
					this.audioDOM.play();
					return;
				} else {  //shuffle
					let index = parseInt(Math.random() * this.props.playSongs.length, 10);
					currentIndex = index;
				}
				this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
				this.props.changeCurrentIndex(currentIndex);
			} else {
				if (this.state.currentPlayMode === 1) {  //repeat current song
					this.audioDOM.play();
				} else {
					//pause
					this.audioDOM.pause();
					this.stopImgRotate();

					this.setState({
						playProgress: 0,
						currentTime: 0,
						playStatus: false
					});
				}
			}
		}, false);
		
		this.audioDOM.addEventListener("error", () => {alert("The song is not available in your region.")}, false);
	}

	playOrPause = () => {
		if(this.state.playStatus === false){
			if (this.first === undefined) {
				this.audioDOM.src = this.currentSong.url;
				this.first = true;
			}
			this.audioDOM.play();
			this.startImgRotate();

			this.setState({
				playStatus: true
			});
		}else{
			this.audioDOM.pause();
			this.stopImgRotate();

			this.setState({
				playStatus: false
			});
		}
	}

	previous = () => {
		if (this.props.playSongs.length > 0 && this.props.playSongs.length !== 1) {
			let currentIndex = this.currentIndex;
			if (this.state.currentPlayMode === 0) {  //repeat list
				if(currentIndex === 0){
					currentIndex = this.props.playSongs.length - 1;
				}else{
					currentIndex = currentIndex - 1;
				}
			} else if (this.state.currentPlayMode === 1) {  //repeat current song
				currentIndex = this.currentIndex;
			} else {  //shuffle
				let index = parseInt(Math.random() * this.props.playSongs.length, 10);
				currentIndex = index;
			}
			this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
			this.props.changeCurrentIndex(currentIndex);
		}
	}

	next = () => {
		if (this.props.playSongs.length > 0  && this.props.playSongs.length !== 1) {
			let currentIndex = this.currentIndex;
			if (this.state.currentPlayMode === 0) {  //repeat list
				if(currentIndex === this.props.playSongs.length - 1){
					currentIndex = 0;
				}else{
					currentIndex = currentIndex + 1;
				}
			} else if (this.state.currentPlayMode === 1) {  //repeat current song
				currentIndex = this.currentIndex;
			} else {  //shuffle
				let index = parseInt(Math.random() * this.props.playSongs.length, 10);
				currentIndex = index;
			}
			this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
			this.props.changeCurrentIndex(currentIndex);
		}
	}
	/**
	 * Rotate album cover
	 */
	startImgRotate = () => {
		if (this.singerImgDOM.className.indexOf("rotate") === -1) {
			this.singerImgDOM.classList.add("rotate");
		} else {
			this.singerImgDOM.style["webkitAnimationPlayState"] = "running";
			this.singerImgDOM.style["animationPlayState"] = "running";
		}
	}
	/**
	 * Stop rotating
	 */
	stopImgRotate = () => {
		this.singerImgDOM.style["webkitAnimationPlayState"] = "paused";
		this.singerImgDOM.style["animationPlayState"] = "paused";
	}
	/**
	 * Show playlist
	 */
	showPlayList = () => {
		this.props.showList(true);
	}
	/**
	 * Hide player
	 */
	hidePlayer = () => {
		this.props.showMusicPlayer(false);
	}
	/**
	 * Show player
	 */
	showPlayer = ()=> {
		this.props.showMusicPlayer(true);
	}
	/**
	 * change play mode
	 */
	changePlayMode = ()=> {
		if (this.state.currentPlayMode === this.playModes.length - 1) {
			this.setState({currentPlayMode:0});
		} else {
			this.setState({currentPlayMode:this.state.currentPlayMode + 1});
		}
	}
	/**
	 * Drag begins
	 */
	handleDrag = (progress) => {
		if (this.audioDOM.duration > 0) {
			this.audioDOM.pause();

			this.stopImgRotate();

			this.setState({
				playStatus: false
			});
			this.dragProgress = progress;
		}
	}
	/**
	 * Drag ends
	 */
	handleDragEnd = () => {
		if (this.audioDOM.duration > 0) {
			let currentTime = this.audioDOM.duration * this.dragProgress;
			this.setState({
				playProgress: this.dragProgress,
				currentTime: currentTime
			}, () => {
				this.audioDOM.currentTime = currentTime;
				this.audioDOM.play();

				this.startImgRotate();

				this.setState({
					playStatus: true
				});
				this.dragProgress = 0;
			});
		}
	}
	render() {
		this.currentIndex = this.props.currentIndex;

		if (this.props.currentSong && this.props.currentSong.url) {
			if (this.currentSong.id !== this.props.currentSong.id) {
				this.currentSong = this.props.currentSong;
				if (this.audioDOM) {
					this.audioDOM.src = this.currentSong.url;
					this.audioDOM.load();
				}
			}
		}
		let song = this.currentSong;

		let playBg = song.img ? song.img : require("@/assets/imgs/play_bg.jpg");

		let playButtonClass = this.state.playStatus === true ? "icon-pause" : "icon-play";

		song.playStatus = this.state.playStatus;
		return (
			<div className="player-container">
				<CSSTransition in={this.props.showStatus} timeout={300} classNames="player-rotate"
					onEnter={() => {
						this.playerDOM.style.display = "block";
					}}
					onExited={() => {
						this.playerDOM.style.display = "none";
					}}>
				<div className="player" ref="player">
					<div className="header">
						<span className="header-back" onClick={this.hidePlayer}>
							<i className="icon-back"></i>
						</span>
						<div className="header-title">
							{song.name}
						</div>
					</div>
					<div className="singer-top">
						<div className="singer">
							<div className="singer-name">{song.singer}</div>
						</div>
					</div>
					<div className="singer-middle">
						<div className="singer-img" ref="singerImg">
							<img src={playBg} alt={song.name} onLoad={
								(e) => {							
									this.playerBgDOM.style.backgroundImage = `url("${playBg}")`;
								}
							}/>
						</div>
					</div>
					<div className="singer-bottom">
						<div className="controller-wrapper">
							<div className="progress-wrapper">
								<span className="current-time">{getTime(this.state.currentTime)}</span>
								<div className="play-progress">
									<Progress progress={this.state.playProgress}
									onDrag={this.handleDrag}
									onDragEnd={this.handleDragEnd}/>
								</div>
								<span className="total-time">{getTime(song.duration)}</span>
							</div>
							<div className="play-wrapper">
								<div className="play-model-button" onClick={this.changePlayMode}>
									<i className={"icon-" + this.playModes[this.state.currentPlayMode] + "-play"}></i>
								</div>
								<div className="previous-button" onClick={this.previous}>
									<i className="icon-previous"></i>
								</div>
								<div className="play-button" onClick={this.playOrPause}>
									<i className={playButtonClass}></i>
								</div>
								<div className="next-button" onClick={this.next}>
									<i className="icon-next"></i>
								</div>
								<div className="play-list-button" onClick={this.showPlayList}>
									<i className="icon-play-list"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="player-bg" ref="playerBg"></div>
					<audio ref="audio"></audio>
				</div>
				</CSSTransition>
				<MiniPlayer song={song} progress={this.state.playProgress} 
					playOrPause={this.playOrPause}
					next={this.next}
					showStatus={this.props.showStatus}
					showMiniPlayer={this.showPlayer}/>
			</div>
		);
	}
}

function getTime(second){
	second = Math.floor(second);
	let minute = Math.floor(second / 60);
	second = second - minute * 60;
	return minute  + ":" + formatTime(second);
}
function formatTime(time){
	let timeStr = "00";
	if(time > 0 && time < 10){
		timeStr = "0" + time;
	}else if(time >= 10){
		timeStr = time;
	}
	return timeStr;
}

export default Player