// ===== GESTION DES DONNÉES =====
let tvData = {
    channels: [],
    ads: [],
    config: {
        adInterval: 3
    }
};

let videoStore = {};
let currentChannelIndex = -1;
let currentVideoIndex = 0;
let videoCount = 0;
let isPlayingAd = false;

// Charger les données au démarrage
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeChannels();
});

// Charger les données du localStorage
function loadData() {
    const saved = localStorage.getItem('tvData');
    if (saved) {
        tvData = JSON.parse(saved);
    }
    
    // Charger les vidéos depuis IndexedDB
    loadVideosFromIndexedDB();
}

// ===== INDEXED DB POUR GROS FICHIERS =====
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TelevisionDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('videos')) {
                db.createObjectStore('videos', { keyPath: 'id' });
            }
        };
    });
}

function loadVideosFromIndexedDB() {
    initIndexedDB().then(db => {
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        const request = store.getAll();
        
        request.onsuccess = () => {
            videoStore = {};
            request.result.forEach(video => {
                videoStore[video.id] = video.data;
            });
        };
    }).catch(err => {
        console.log('IndexedDB non disponible');
    });
}

// Initialiser le sélecteur de chaîne
function initializeChannels() {
    const channelsSelect = document.getElementById('channels');
    if (!channelsSelect) return;
    
    channelsSelect.innerHTML = '<option value="">-- Choisir une chaîne --</option>';
    
    tvData.channels.forEach((channel, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = channel.name;
        channelsSelect.appendChild(option);
    });
}

// Changer de chaîne
function changeChannel() {
    const select = document.getElementById('channels');
    const index = parseInt(select.value);
    
    if (select.value === '' || isNaN(index)) {
        stopTV();
        return;
    }
    
    currentChannelIndex = index;
    currentVideoIndex = 0;
    videoCount = 0;
    
    loadChannelVideos();
    playNextVideo();
}

// Charger et afficher la playlist
function loadChannelVideos() {
    if (currentChannelIndex === -1) return;
    
    const channel = tvData.channels[currentChannelIndex];
    const playlist = document.getElementById('playlist');
    const currentChannelSpan = document.getElementById('currentChannel');
    
    if (!playlist) return;
    
    playlist.innerHTML = '';
    currentChannelSpan.textContent = channel.name;
    
    if (channel.videos && channel.videos.length > 0) {
        channel.videos.forEach((video, index) => {
            const li = document.createElement('li');
            li.className = index === currentVideoIndex ? 'current' : '';
            li.innerHTML = `
                <span class="video-name">${video.title}</span>
                <span class="video-duration">${formatTime(video.duration)}</span>
            `;
            li.addEventListener('click', () => {
                currentVideoIndex = index;
                videoCount = 0;
                playNextVideo();
            });
            playlist.appendChild(li);
        });
    } else {
        playlist.innerHTML = '<li style="color: #999;">Aucune vidéo dans cette chaîne</li>';
    }
}

// Jouer la prochaine vidéo
function playNextVideo() {
    if (currentChannelIndex === -1) return;
    
    const channel = tvData.channels[currentChannelIndex];
    if (!channel.videos || channel.videos.length === 0) return;
    
    // Vérifier si c'est le moment de montrer une pub
    if (videoCount > 0 && videoCount % tvData.config.adInterval === 0 && tvData.ads.length > 0) {
        playRandomAd();
        return;
    }
    
    // Jouer la vidéo
    const video = channel.videos[currentVideoIndex];
    const videoPlayer = document.getElementById('videoPlayer');
    const currentVideoSpan = document.getElementById('currentVideo');
    const nextVideoSpan = document.getElementById('nextVideo');
    
    // Récupérer le blob depuis IndexedDB
    if (videoStore[video.id]) {
        const blobUrl = URL.createObjectURL(new Blob([videoStore[video.id]], { type: 'video/mp4' }));
        videoPlayer.src = blobUrl;
    } else {
        console.error('Vidéo non trouvée:', video.id);
        return;
    }
    
    currentVideoSpan.textContent = video.title;
    
    // Afficher la prochaine vidéo
    const nextIndex = (currentVideoIndex + 1) % channel.videos.length;
    nextVideoSpan.textContent = channel.videos[nextIndex].title;
    
    // Mettre à jour la playlist
    updatePlaylistUI();
    
    // Jouer la vidéo
    videoPlayer.play();
    
    // Passer à la vidéo suivante quand celle-ci est terminée
    videoPlayer.onended = () => {
        videoCount++;
        currentVideoIndex = (currentVideoIndex + 1) % channel.videos.length;
        setTimeout(() => playNextVideo(), 1000);
    };
}

// Jouer une pub aléatoire
function playRandomAd() {
    if (tvData.ads.length === 0) {
        playNextVideo();
        return;
    }
    
    isPlayingAd = true;
    const ad = tvData.ads[Math.floor(Math.random() * tvData.ads.length)];
    const adModal = document.getElementById('adModal');
    const adPlayer = document.getElementById('adPlayer');
    const adCountdown = document.getElementById('adCountdown');
    
    // Récupérer le blob depuis IndexedDB
    if (videoStore[ad.id]) {
        const blobUrl = URL.createObjectURL(new Blob([videoStore[ad.id]], { type: 'video/mp4' }));
        adPlayer.src = blobUrl;
    } else {
        console.error('Pub non trouvée:', ad.id);
        playNextVideo();
        return;
    }
    
    adModal.classList.remove('hidden');
    
    let countdown = Math.ceil(ad.duration);
    adCountdown.textContent = countdown;
    
    // Mettre à jour le compte à rebours
    const countdownInterval = setInterval(() => {
        countdown--;
        adCountdown.textContent = countdown;
        document.getElementById('adTimer').textContent = countdown;
    }, 1000);
    
    // Fermer la pub après sa durée
    setTimeout(() => {
        clearInterval(countdownInterval);
        adModal.classList.add('hidden');
        adPlayer.pause();
        isPlayingAd = false;
        playNextVideo();
    }, ad.duration * 1000);
    
    adPlayer.play();
}

// Mettre à jour l'interface de la playlist
function updatePlaylistUI() {
    const items = document.querySelectorAll('.playlist li');
    items.forEach((item, index) => {
        item.classList.remove('current');
        if (index === currentVideoIndex) {
            item.classList.add('current');
        }
    });
}

// Arrêter la TV
function stopTV() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
    
    const currentChannel = document.getElementById('currentChannel');
    const currentVideo = document.getElementById('currentVideo');
    const nextVideo = document.getElementById('nextVideo');
    const playlist = document.getElementById('playlist');
    
    if (currentChannel) currentChannel.textContent = 'Aucune';
    if (currentVideo) currentVideo.textContent = '-';
    if (nextVideo) nextVideo.textContent = '-';
    if (playlist) playlist.innerHTML = '';
    
    currentChannelIndex = -1;
}

// Formater le temps en mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Écouter les changements de données
window.addEventListener('storage', (event) => {
    if (event.key === 'tvDataUpdated') {
        loadData();
        initializeChannels();
        if (currentChannelIndex !== -1) {
            loadChannelVideos();
        }
    }
});
