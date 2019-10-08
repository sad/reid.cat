const input = document.querySelector('input');
const trackDisplay = document.querySelector('#track');
const albumDisplay = document.querySelector('#album');
const lastDisplay = document.querySelector('#last');

const host = window.location.host.includes('reid') ? window.location.host : 'reid.cat';
const mail = ['hi', String.fromCharCode(64), host.replace('www.', '')].join('');
const xhr = new XMLHttpRequest();

const lastfm = {
  url: 'https://ws.audioscrobbler.com/2.0/',
  user: 'reid',
  apiKey: '1f633977acf0e2d0630ec11dbc350d3e',
  recent: 'user.getrecenttracks',
  top: 'user.gettopartists',
  topPeriod: '1month',
  topAmount: 3,
  fetchInterval: 7000,
};

const fadeIn = () => {
  lastDisplay.setAttribute('style', 'display: inherit;');
};

const renderCurrent = (res) => {
  const track = res.recenttracks.track[0].name;
  const artist = res.recenttracks.track[0].artist['#text'];
  const album = res.recenttracks.track[0].album['#text'];

  const source = album.trim() === '' ? 'SoundCloud' : `"${album.toLowerCase()}"`;
  const search = encodeURIComponent(`${artist} - ${track}`);

  const link = source === 'SoundCloud' ? `https://soundcloud.com/search?q=${search}` : `https://www.youtube.com/results?search_query=${search}`;
  const finder = document.createElement('a');

  finder.innerText = `${artist.toLowerCase()} - ${track.toLowerCase()}`;
  finder.href = link;
  trackDisplay.innerHTML = 'now playing: ';
  albumDisplay.innerHTML = `from <span>${source}</span>`;
  trackDisplay.appendChild(finder);
  fadeIn();
};

const renderTop = (res) => {
  let topArtists = '';
  for (let i = 0; i < lastfm.topAmount; i += 1) {
    const trailer = i === lastfm.topAmount - 1 ? '' : ', ';
    topArtists += `<strong>${res.topartists.artist[i].name.toLowerCase()}</strong>${trailer}`;
    if (i === lastfm.topAmount - 1) {
      trackDisplay.innerHTML = 'now playing: <strong>nothing</strong>';
      albumDisplay.innerHTML = `top artists: <em>${topArtists}</em>`;
      fadeIn();
    }
  }
};

const xhrGet = (url, callback) => {
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.response));
    }
  };
};

const renderLastfm = () => {
  xhrGet(`${lastfm.url}?method=${lastfm.recent}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json`, (recRes) => {
    if (recRes.recenttracks.track[0]['@attr'] !== undefined) {
      renderCurrent(recRes);
    } else {
      xhrGet(`${lastfm.url}?method=${lastfm.top}&user=${lastfm.user}&api_key=${lastfm.apiKey}&format=json&period=${lastfm.topPeriod}`, (topRes) => {
        renderTop(topRes);
      });
    }
  });
};

input.value = mail;
input.addEventListener('click', (event) => {
  event.target.focus();
  event.target.select();
});

renderLastfm();
setInterval(renderLastfm, lastfm.fetchInterval);
