// ===== GESTION DES DONNÉES ADMIN =====
let tvData = {
    channels: [],
    ads: [],
    config: {
        adInterval: 3
    }
};

// Charger les données au démarrage
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    refreshChannels();
    refreshAds();
    loadAdInterval();
    refreshChannelsSelect();
});

// Charger les données du localStorage
function loadData() {
    const saved = localStorage.getItem('tvData');
    if (saved) {
        tvData = JSON.parse(saved);
    }
}

// Sauvegarder les données
function saveData() {
    localStorage.setItem('tvData', JSON.stringify(tvData));
    // Notifier la TV de la mise à jour
    window.localStorage.setItem('tvDataUpdated', new Date().toISOString());
    showNotification('✅ Données sauvegardées!');
}

// ===== GESTION DES CHAÎNES =====
function addChannel() {
    const nameInput = document.getElementById('channelName');
    const descInput = document.getElementById('channelDesc');
    
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    
    if (!name) {
        showNotification('❌ Veuillez entrer un nom de chaîne', true);
        return;
    }
    
    // Vérifier si la chaîne existe déjà
    if (tvData.channels.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showNotification('❌ Cette chaîne existe déjà', true);
        return;
    }
    
    const channel = {
        id: Date.now(),
        name: name,
        description: description || 'Chaîne',
        videos: []
    };
    
    tvData.channels.push(channel);
    saveData();
    
    nameInput.value = '';
    descInput.value = '';
    
    refreshChannels();
    refreshChannelsSelect();
    showNotification('✅ Chaîne ajoutée!');
}

function deleteChannel(index) {
    if (confirm('Êtes-vous sûr de supprimer cette chaîne?')) {
        tvData.channels.splice(index, 1);
        saveData();
        refreshChannels();
        refreshChannelsSelect();
        showNotification('✅ Chaîne supprimée!');
    }
}

function refreshChannels() {
    const list = document.getElementById('channelsList');
    list.innerHTML = '';
    
    if (tvData.channels.length === 0) {
        list.innerHTML = '<li style="color: #999;">Aucune chaîne créée</li>';
        return;
    }
    
    tvData.channels.forEach((channel, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">📺 ${channel.name}</span>
                <span class="item-desc">${channel.description}</span>
                <span class="item-desc">${channel.videos.length} vidéo(s)</span>
            </div>
            <div class="item-actions">
                <button onclick="deleteChannel(${index})">🗑️ Supprimer</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function refreshChannelsSelect() {
    const select = document.getElementById('videosChannel');
    select.innerHTML = '<option value="">-- Choisir une chaîne --</option>';
    
    tvData.channels.forEach((channel, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = channel.name;
        select.appendChild(option);
    });
}

// ===== GESTION DES VIDÉOS =====
function addVideo() {
    const channelSelect = document.getElementById('videosChannel');
    const titleInput = document.getElementById('videoTitle');
    const fileInput = document.getElementById('videoFile');
    const durationInput = document.getElementById('videoDuration');
    
    const channelIndex = parseInt(channelSelect.value);
    const title = titleInput.value.trim();
    const file = fileInput.files[0];
    const duration = parseInt(durationInput.value);
    
    if (isNaN(channelIndex)) {
        showNotification('❌ Veuillez sélectionner une chaîne', true);
        return;
    }
    
    if (!title) {
        showNotification('❌ Veuillez entrer un titre', true);
        return;
    }
    
    if (!file) {
        showNotification('❌ Veuillez sélectionner un fichier vidéo', true);
        return;
    }
    
    if (!duration || duration <= 0) {
        showNotification('❌ Veuillez entrer une durée valide', true);
        return;
    }
    
    // Convertir le fichier en base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const video = {
            id: Date.now(),
            title: title,
            path: e.target.result,
            duration: duration,
            filename: file.name
        };
        
        tvData.channels[channelIndex].videos.push(video);
        saveData();
        
        titleInput.value = '';
        fileInput.value = '';
        durationInput.value = '';
        
        loadChannelVideos();
        showNotification('✅ Vidéo ajoutée!');
    };
    
    reader.readAsDataURL(file);
}

function deleteVideo(channelIndex, videoIndex) {
    if (confirm('Êtes-vous sûr de supprimer cette vidéo?')) {
        tvData.channels[channelIndex].videos.splice(videoIndex, 1);
        saveData();
        loadChannelVideos();
        showNotification('✅ Vidéo supprimée!');
    }
}

function loadChannelVideos() {
    const channelSelect = document.getElementById('videosChannel');
    const channelIndex = parseInt(channelSelect.value);
    const list = document.getElementById('videosList');
    
    list.innerHTML = '';
    
    if (isNaN(channelIndex)) {
        list.innerHTML = '<li style="color: #999;">Sélectionnez une chaîne</li>';
        return;
    }
    
    const channel = tvData.channels[channelIndex];
    
    if (!channel.videos || channel.videos.length === 0) {
        list.innerHTML = '<li style="color: #999;">Aucune vidéo dans cette chaîne</li>';
        return;
    }
    
    channel.videos.forEach((video, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">🎬 ${video.title}</span>
                <span class="item-desc">Durée: ${video.duration}s</span>
            </div>
            <div class="item-actions">
                <button onclick="deleteVideo(${channelIndex}, ${index})">🗑️ Supprimer</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ===== GESTION DES PUBLICITÉS =====
function addAd() {
    const titleInput = document.getElementById('adTitle');
    const fileInput = document.getElementById('adFile');
    const durationInput = document.getElementById('adDuration');
    
    const title = titleInput.value.trim();
    const file = fileInput.files[0];
    const duration = parseInt(durationInput.value);
    
    if (!title) {
        showNotification('❌ Veuillez entrer un titre', true);
        return;
    }
    
    if (!file) {
        showNotification('❌ Veuillez sélectionner un fichier vidéo', true);
        return;
    }
    
    if (!duration || duration <= 0) {
        showNotification('❌ Veuillez entrer une durée valide', true);
        return;
    }
    
    // Convertir le fichier en base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const ad = {
            id: Date.now(),
            title: title,
            path: e.target.result,
            duration: duration,
            filename: file.name
        };
        
        tvData.ads.push(ad);
        saveData();
        
        titleInput.value = '';
        fileInput.value = '';
        durationInput.value = '';
        
        refreshAds();
        showNotification('✅ Pub ajoutée!');
    };
    
    reader.readAsDataURL(file);
}

function deleteAd(index) {
    if (confirm('Êtes-vous sûr de supprimer cette pub?')) {
        tvData.ads.splice(index, 1);
        saveData();
        refreshAds();
        showNotification('✅ Pub supprimée!');
    }
}

function refreshAds() {
    const list = document.getElementById('adsList');
    list.innerHTML = '';
    
    if (tvData.ads.length === 0) {
        list.innerHTML = '<li style="color: #999;">Aucune pub créée</li>';
        return;
    }
    
    tvData.ads.forEach((ad, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">📢 ${ad.title}</span>
                <span class="item-desc">Durée: ${ad.duration}s</span>
            </div>
            <div class="item-actions">
                <button onclick="deleteAd(${index})">🗑️ Supprimer</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ===== CONFIGURATION =====
function loadAdInterval() {
    document.getElementById('adInterval').value = tvData.config.adInterval;
}

function saveConfig() {
    const interval = parseInt(document.getElementById('adInterval').value);
    
    if (!interval || interval <= 0) {
        showNotification('❌ Veuillez entrer un intervalle valide', true);
        return;
    }
    
    tvData.config.adInterval = interval;
    saveData();
    showNotification('✅ Configuration sauvegardée!');
}

// ===== EXPORT/IMPORT =====
function exportData() {
    const dataStr = JSON.stringify(tvData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tv-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('✅ Données exportées!');
}

function clearData() {
    if (confirm('⚠️ Êtes-vous VRAIMENT sûr? Toutes les données seront supprimées!')) {
        tvData = {
            channels: [],
            ads: [],
            config: {
                adInterval: 3
            }
        };
        saveData();
        refreshChannels();
        refreshAds();
        refreshChannelsSelect();
        loadAdInterval();
        showNotification('✅ Toutes les données ont été supprimées');
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (isError) {
        notification.style.background = '#e94560';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Écouter les changements depuis la TV
window.addEventListener('storage', (event) => {
    if (event.key === 'tvDataUpdated') {
        loadData();
    }
});
