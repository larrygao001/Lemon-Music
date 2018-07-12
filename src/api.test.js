import {getCarousel, getNewAlbum, getAlbumInfo} from "./api/recommend";
import {getRankingList, getRankingInfo} from "./api/ranking";
import {getSongVKey} from "./api/song";
import {getHotKey, search} from "./api/search"
import {getSingerList, getSingerInfo} from "./api/singer"

getCarousel().then((res) => {
	console.log("Get repeat list：");
	if (res) {
		console.log(res);
	}
});

getNewAlbum().then((res) => {
	console.log("Get latest albums：");
	if (res) {
		console.log(res);
	}
});

getAlbumInfo("0007kqbv3ZbOtl").then((res) => {
	console.log("Get albums details：");
	if (res) {
		console.log(res);
	}
});

getRankingList().then((res) => {
	console.log("Get leaderboard：");
	if (res) {
		console.log(res);
	}
});

getRankingInfo(4).then((res) => {
	console.log("Get leaderboard details：");
	if (res) {
		console.log(res);
	}
});

getSongVKey("000OFXjz0Nljbh").then((res) => {
	console.log("Get songs vkey：");
	if (res) {
		console.log(res);
	}
});

getHotKey().then((res) => {
	console.log("Get trending searches：");
	if (res) {
		console.log(res);
	}
});

search("Taylor Swift").then((res) => {
	console.log("Search：");
	if (res) {
		console.log(res);
	}
});

getSingerList(1, "all_all_all").then((res) => {
	console.log("Get singers list：");
	if (res) {
		console.log(res);
	}
});

getSingerInfo("001iI8LW0ZRpXn").then((res) => {
	console.log("Get singers details：");
	if (res) {
		console.log(res);
	}
});