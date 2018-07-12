import { combineReducers } from 'redux'
import * as ActionTypes from "./actionTypes"
import localStorage from "../util/storage"

const initialState = {
	skin: localStorage.getSkin(),  
	showStatus: false,  
	song: localStorage.getCurrentSong(),  
	songs: localStorage.getSongs()  
};


function skin(skin = initialState.skin, action) {
	switch (action.type) {
		case ActionTypes.SET_SKIN:
			localStorage.setSkin(action.skin);
			return action.skin;
		default:
			return skin;
	}
}


function showStatus(showStatus = initialState.showStatus, action) {
	switch (action.type) {
		case ActionTypes.SHOW_PLAYER:
			return action.showStatus;
		default:
			return showStatus;
	}
}

function song(song = initialState.song, action) {
	switch (action.type) {
		case ActionTypes.CHANGE_SONG:
			localStorage.setCurrentSong(action.song);
			return action.song;
		default:
			return song;
	}
}

function songs(songs = initialState.songs, action) {
	switch (action.type) {
		case ActionTypes.SET_SONGS:
			localStorage.setSongs(action.songs);
			return action.songs;
		case ActionTypes.REMOVE_SONG_FROM_LIST:
			let newSongs = songs.filter(song => song.id !== action.id);
			localStorage.setSongs(newSongs);
			return newSongs;
		default:
			return songs;
	}
}


const reducer = combineReducers({
	skin,
	showStatus,
	song,
	songs
});

export default reducer