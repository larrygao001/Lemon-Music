import React from "react"
import {BrowserRouter as Router, Route, Switch, Redirect, NavLink} from "react-router-dom"

import Recommend from "./recommend/Recommend"
import Ranking from "./ranking/Ranking"
import SingerList from "./singer/SingerList"
import Search from "../containers/Search"
import MusicPlayer from "./play/MusicPlayer"
import MusicMenu from "./setting/Menu"

import logo from "../assets/imgs/logo.png"
import "../assets/stylus/reset.styl"
import "../assets/stylus/font.styl"
import "./App.styl"

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuShow: false
    };
  }
  render() {
    return (
        <Router>
          <div className="app skin-app">
            <header className="app-header skin-app-header">
              <i className="icon-et-more app-more" onClick={() => {this.setState({menuShow: true});}}></i>
              <img src={logo} className="app-logo" alt="logo" />
              <h1 className="app-title">Lemon Music</h1>
            </header>
            <div className="music-tab skin-music-tab">
              <div className="tab-item recommendation-tab">
                <NavLink to="/recommend" className="nav-link">
                  <span>Recommendation</span>
                </NavLink>
              </div>
              <div className="tab-item">
                <NavLink to="/ranking" className="nav-link">
                  <span>Ranking</span>
                </NavLink>
              </div>
              <div className="tab-item">
                <NavLink to="/singer" className="nav-link">
                  <span>Singers</span>
                </NavLink>
              </div>
              <div className="tab-item">
                <NavLink to="/search" className="nav-link">
                  <span>Search</span>
                </NavLink>
              </div>
            </div>
            <div className="music-view">
              {/*
                Switch section to select nearest route
                Redirect to the list page
              */}
              <Switch>
                <Route path="/recommend" component={Recommend} />
                <Route path="/ranking" component={Ranking} />
                <Route path="/singer" component={SingerList} />
                <Route path="/search" component={Search} />
                <Redirect from="/" to="/recommend" />
                <Route component={Recommend} />
              </Switch>
            </div>
            <MusicPlayer />
            <MusicMenu show={this.state.menuShow} 
            closeMenu={() => {this.setState({menuShow: false});}} />
          </div>
        </Router>
    );
  }
}

export default App;
