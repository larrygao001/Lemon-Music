import React from "react"
import ReactDOM from "react-dom"
import {Route} from "react-router-dom"
import LazyLoad, { forceCheck } from "react-lazyload"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import Singer from "@/containers/Singer"
import {getSingerList} from "@/api/singer"
import {CODE_SUCCESS} from "@/api/config"
import * as SingerModel from "@/model/singer"

import "core-js/es6/array"

import "./singerlist.styl"

class SingerList extends React.Component {
	constructor(props) {
		super(props);

		this.types = [
			{key:"all_all", name:"All"},
			{key:"cn_man", name:"Chinese Male"},
			{key:"cn_woman", name:"Chinese Female"},
			{key:"cn_team", name:"Chinese Groups"},
			{key:"k_man", name:"Korean Male"},
			{key:"k_woman", name:"Korean Female"},
			{key:"k_team", name:"Korean Groups"},
			{key:"j_man", name:"Japanese Male"},
			{key:"j_woman", name:"Japanese Female"},
			{key:"j_team", name:"Japanese Groups"},
			{key:"eu_man", name:"US and European Male"},
			{key:"eu_woman", name:"US and European Female"},
			{key:"eu_team", name:"US and European Groups"},
			{key:"other_other", name:"Others"}
		];
		this.indexs = [
			{key:"all", name:"Hot"},
			{key:"A", name:"A"},
			{key:"B", name:"B"},
			{key:"C", name:"C"},
			{key:"D", name:"D"},
			{key:"E", name:"E"},
			{key:"F", name:"F"},
			{key:"G", name:"G"},
			{key:"H", name:"H"},
			{key:"I", name:"I"},
			{key:"J", name:"J"},
			{key:"K", name:"K"},
			{key:"L", name:"L"},
			{key:"M", name:"M"},
			{key:"N", name:"N"},
			{key:"O", name:"O"},
			{key:"P", name:"P"},
			{key:"Q", name:"Q"},
			{key:"R", name:"R"},
			{key:"S", name:"S"},
			{key:"T", name:"T"},
			{key:"U", name:"U"},
			{key:"V", name:"V"},
			{key:"W", name:"W"},
			{key:"X", name:"X"},
			{key:"Y", name:"Y"},
			{key:"Z", name:"Z"}
		];

		this.state = {
			loading: true,
			typeKey: "all_all",
			indexKey: "all",
			singers: [],
			refreshScroll: false
		}
	}
	componentDidMount() {
		this.initNavScrollWidth();

		this.getSingers();
	}
	initNavScrollWidth() {
		let tagDOM = ReactDOM.findDOMNode(this.refs.tag);
		let tagElems = tagDOM.querySelectorAll("a");
		let tagTotalWidth = 0;
		Array.from(tagElems).forEach(a => {
			tagTotalWidth += a.offsetWidth;
		});
		tagDOM.style.width = `${tagTotalWidth}px`;

		let indexDOM = ReactDOM.findDOMNode(this.refs.index);
		let indexElems = indexDOM.querySelectorAll("a");
		let indexTotalWidth = 0;
		Array.from(indexElems).forEach(a => {
			indexTotalWidth += a.offsetWidth;
		});
		indexDOM.style.width = `${indexTotalWidth}px`;
	}
	getSingers() {
		getSingerList(1, `${this.state.typeKey + '_' + this.state.indexKey}`).then((res) => {
			//console.log("Get singers list：");
			if (res) {
				//console.log(res);
				if (res.code === CODE_SUCCESS) {
					let singers = [];
					res.data.list.forEach(data => {
						let singer = new SingerModel.Singer(data.Fsinger_id, data.Fsinger_mid, data.Fsinger_name,
					`https://y.gtimg.cn/music/photo_new/T001R150x150M000${data.Fsinger_mid}.jpg?max_age=2592000`);
						singers.push(singer);
					});
					this.setState({
						loading: false,
						singers
					}, () => {
						//Refresh scroll
						this.setState({refreshScroll:true});
					});
				}
			}
		});
	}
	handleTypeClick = (key) => {
		this.setState({
			loading: true,
			typeKey: key,
			indexKey: "all",
			singers: []
		}, () => {
			this.getSingers();
		});
	}
	handleIndexClick = (key) => {
		this.setState({
			loading: true,
			indexKey: key,
			singers: []
		}, () => {
			this.getSingers();
		});
	}
	toDetail = (url) => {
		this.props.history.push({
			pathname: url
		});
	}
	render() {
		let {match} = this.props;
		let tags = this.types.map(type => (
				<a key={type.key} 
				className={type.key === this.state.typeKey ? "choose" : ""}
				onClick={() => {this.handleTypeClick(type.key);}}>
				{type.name}</a>
			));
		let indexs = this.indexs.map(type => (
				<a key={type.key}
				className={type.key === this.state.indexKey ? "choose" : ""}
				onClick={() => {this.handleIndexClick(type.key);}}>
				{type.name}</a>
			));
		let singers = this.state.singers.map(singer => {
				return (
					<div className="singer-wraper" key={singer.id}
					onClick={() => {this.toDetail(`${match.url + '/' + singer.mId}`)}}>
						<div className="singer-img">
							<LazyLoad height={50}>
							<img src={singer.img} width="100%" height="100%" alt={singer.name}
							onError={(e) => {
								e.currentTarget.src = require("@/assets/imgs/music.png");
							}}/>
							</LazyLoad>
						</div>
						<div className="singer-name">
							{singer.name}
						</div>
					</div>
				);
			});
		return (
			<div className="music-singers skin-music-singers">
				<div className="nav">
					<Scroll direction="horizontal">
						<div className="tag" ref="tag">
							{tags}
						</div>
					</Scroll>
					<Scroll direction="horizontal">
						<div className="index" ref="index">
							{indexs}
						</div>
					</Scroll>
				</div>
				<div className="singer-list">
					<Scroll refresh={this.state.refreshScroll}
						onScroll={() => {forceCheck();}} ref="singerScroll">
						<div className="singer-container">
							{singers}
						</div>
					</Scroll>
				</div>
				<Loading title="Loading..." show={this.state.loading}/>
				<Route path={`${match.url + '/:id'}`} component={Singer}/>
			</div>
		)
	}
}

export default SingerList