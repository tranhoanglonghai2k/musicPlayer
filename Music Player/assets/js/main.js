/*
	1. Render song --> OK
	2. Scroll top --> OK
	3. Play/pause/seek --> OK
	4. CD rotate --> OK
	5. Next/prev --> OK
	6. Random --> OK
	7. Next/repeat when ended --> OK
	8. Active song --> OK
	9. Scroll active song into view --> OK
	10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playlist = $('.playlist');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	songs: [
		{
			name: 'Tâm sự tuổi 30 (OST)',
			singer: 'Trịnh Thăng Bình',
			path: './assets/music/tamsutuoi30.mp3',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Tr%E1%BB%8Bnh_th%C4%83ng_b%C3%ACnh.jpg/440px-Tr%E1%BB%8Bnh_th%C4%83ng_b%C3%ACnh.jpg'
		},
		{
			name: 'Người ấy',
			singer: 'Trịnh Thăng Bình',
			path: './assets/music/nguoiay.mp3',
			img: 'https://avatar-ex-swe.nixcdn.com/song/2018/05/06/5/1/b/4/1525584647394_300.jpg'
		},
		{
			name: 'Chưa bao giờ',
			singer: 'DSK',
			path: './assets/music/chuabaogio.mp3',
			img: 'https://vietthuong.vn/upload/content/images/tu-van/t-8/co-am-nhac-cuoc-song-tuoi-dep-hon-1.gif'
		},
		{
			name: 'Vỡ Tan',
			singer: 'Trịnh Thăng Bình',
			path: './assets/music/votan.mp3',
			img: 'https://nld.mediacdn.vn/2018/1/30/img6385-1517286816975794949226.jpg'
		},
		{
			name: 'Em làm gì tối nay',
			singer: 'Khắc Việt',
			path: './assets/music/emlamgitoinay.mp3',
			img: 'https://vnn-imgs-f.vgcloud.vn/2021/06/30/13/cao-thai-son-len-tieng-khi-bi-to-hat-2-ca-khuc-nathan-lee-mua-doc-quyen.jpeg'
		},
		{
			name: 'Lon Roi',
			singer: 'DSK',
			path: './assets/music/lonroi.mp3',
			img: 'https://vietthuong.vn/upload/content/images/tu-van/t-8/co-am-nhac-cuoc-song-tuoi-dep-hon-1.gif'
		},
		{
			name: 'Yêu',
			singer: 'Khắc Việt',
			path: './assets/music/yeu.mp3',
			img: 'https://znews-photo.zadn.vn/w660/Uploaded/ohunuai/2021_05_23/kvit.jpg'
		},
		{
			name: 'Anh khác hay em khác',
			singer: 'Khắc Việt',
			path: './assets/music/anhkhachayemkhac.mp3',
			img: 'https://cdn.24h.com.vn/upload/4-2018/images/2018-10-30/1540870446-795-hot-5-1540869011-width640height480.jpg'
		},
		{
			name: 'To the moon',
			singer: 'Hooligan',
			path: './assets/music/ToTheMoon.mp3',
			img: 'https://avatar-ex-swe.nixcdn.com/song/2020/07/02/5/d/c/9/1593664626011_640.jpg'
		},
		{
			name: 'Gái độc thân',
			singer: 'Tlinh',
			path: './assets/music/gaidocthan.mp3',
			img: 'https://znews-photo.zadn.vn/w660/Uploaded/izhqv/2020_11_13/avatilinh.jpg'
		},
	],
	setConfig: function(key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	render: function() {
		const htmls = this.songs.map((song, index) => {
			return `
			<div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
				<div class="thumb" style="background-image: url('${song.img}')"></div>
				<div class="body">
					<h3 class="title">${song.name}</h3>
					<p class="author">${song.singer}</p>
				</div>
				<div class="option">
					<i class="fas fa-ellipsis-h"></i>
				</div>
			</div>
			`
		});

		playlist.innerHTML = htmls.join('');
	},
	defineProperties: function() {
		Object.defineProperty(this, 'currentSong', {
			get: function() {
				return this.songs[this.currentIndex];
			}
		})
	},
	handleEvents: function() {
		const cdWidth = cd.offsetWidth;
		const _this = this;

		// Xử lý CD quay/dừng
		const cdThumbAnimate = cdThumb.animate([
			{
				transform: 'rotate(360deg)'
			}
		], {
			duration: 10000,
			iterations: Infinity	
		})
		cdThumbAnimate.pause();

		// Xử lý phóng to/ thu nhỏ CD
		document.onscroll = function() {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const newCdWWidrh = cdWidth - scrollTop;

			cd.style.width = newCdWWidrh > 0 ?  newCdWWidrh + 'px':0;
			cd.style.opacity = newCdWWidrh / cdWidth;
		};

		// Xử lý khi click play
		playBtn.onclick = function() {
			if (_this.isPlaying) {
				audio.pause();

			}
			else {	
				audio.play();

			}
		};

		// Khi song được play
		audio.onplay = function() {
			_this.isPlaying = true;
			player.classList.add('playing');
			cdThumbAnimate.play();
		};

		// Khi song bị pause
		audio.onpause = function() {
			_this.isPlaying = false;
			player.classList.remove('playing');
			cdThumbAnimate.pause();
		};

		// Khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function() {
			const progressPercent = Math.floor(audio.currentTime/audio.duration * 100);
			progress.value = progressPercent;
		};

		// Xử lý khi tua song 
		progress.oninput = function(e){
			// từ số phần trăm của giây convert sang giây
			const seekTime = audio.duration / 100 * e.target.value; 
			audio.currentTime = seekTime;
			audio.play();
		}

		// Khi next bài hát
		nextBtn.onclick = function() {
			if (_this.isRandom) {
				_this.playRandomSong();
			}
			else {
				_this.nextSong();
			}
			
			audio.play();
			_this.render();
			_this.scrollToActiveSong();
		}

		// Khi previous bài hát
		prevBtn.onclick = function() {
			if (_this.isRandom) {
				_this.playRandomSong();
			}
			else {
				_this.prevSong();
			}

			audio.play();
		}

		// Khi random bài hát
		randomBtn.onclick = function() {
			_this.isRandom = !_this.isRandom;
			_this.setConfig('isRandom', _this.isRandom);
			randomBtn.classList.toggle('active', _this.isRandom);
		}

		// Xử lý lặp lại song
		repeatBtn.onclick = function() {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			repeatBtn.classList.toggle('active', _this.isRepeat);
		}
		
		// Xử lý next Song khi audio ended
		audio.onended = function() {
			if (_this.isRepeat) {
				audio.play();
			}
			else {
				nextBtn.click();
			}
		}

		// Lắng nghe hành vi click vào playlist
		playlist.onclick = function(e) {
			const songNode = e.target.closest('.song:not(.active)');
			
			if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
				// Xử lý khi click vào song
				if (songNode) {
					_this.currentIndex = Number(songNode.dataset.index);
					_this.loadCurrentSong();
					_this.render();
					audio.play();
				}
			}
		}
	},
	loadConfig: function() {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
	},
	loadCurrentSong: function() {
		heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
		audio.src = this.currentSong.path; 
	},
	scrollToActiveSong: function() {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}, 500)
	},
	nextSong: function() {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}

		this.loadCurrentSong();
	},
	prevSong: function() {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}

		this.loadCurrentSong();
	},
	playRandomSong: function() {
		let newIndex;

		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while(newIndex === this.currentIndex)

		this.currentIndex = newIndex;
		this.loadCurrentSong();
	},
	start: function() {
		// Gán cấu hình từ config vào ứng dụng 
		this.loadConfig();

		// Định nghĩa các thuộc tính cho Object
		this.defineProperties();

		// Lắng nghe/xử lý các sự kiện (DOM events)
		this.handleEvents();

		// Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong();

		// Render playlist
		this.render();

		// Hiển thị trạng thái ban đầu của button Random và Repeat
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
	}
};

app.start();