// blocks/video-youtube/render.js - Self-loading version
const ABF_VIDEO_PLAYERS_KEY = '__abfGlobalVideoPlayers';
const ABF_VIDEO_MAP_KEY = '__abfVideoYoutubeMap';

async function ensurePlyrLoaded() {
    if (!window.Plyr) {
        const { default: Plyr } = await import('plyr');
        window.Plyr = Plyr;
    }
}

function ensureGlobalStores() {
    if (!window[ABF_VIDEO_PLAYERS_KEY]) {
        window[ABF_VIDEO_PLAYERS_KEY] = new Set();
    }

    if (!window[ABF_VIDEO_MAP_KEY]) {
        window[ABF_VIDEO_MAP_KEY] = new WeakMap();
    }

    return {
        registeredPlayers: window[ABF_VIDEO_PLAYERS_KEY],
        playerMap: window[ABF_VIDEO_MAP_KEY],
    };
}

function wirePlayerEvents({ player, block, playBtn, autoplayMuted, registeredPlayers }) {
    player.on('play', () => {
        registeredPlayers.forEach((otherPlayer) => {
            if (otherPlayer === player) return;

            if (!otherPlayer.paused) {
                otherPlayer.pause();
            }
        });

        if (!autoplayMuted && playBtn) {
            block.classList.add('is-playing');
            block.classList.remove('is-paused');
            playBtn.classList.add('is-hidden');
            playBtn.setAttribute('aria-hidden', 'true');
        }
    });

    player.on('pause', () => {
        if (!autoplayMuted && playBtn) {
            block.classList.remove('is-playing');
            block.classList.add('is-paused');
            playBtn.classList.remove('is-hidden');
            playBtn.removeAttribute('aria-hidden');
        }
    });

    player.on('ended', () => {
        if (!autoplayMuted && playBtn) {
            block.classList.remove('is-playing');
            block.classList.add('is-paused');
            playBtn.classList.remove('is-hidden');
            playBtn.removeAttribute('aria-hidden');
        }
    });
}

async function createPlayerForBlock({
    block,
    playerElement,
    playBtn,
    unmuteBtn,
    autoplayMuted,
    registeredPlayers,
    playerMap,
}) {
    if (playerMap.has(block)) {
        return playerMap.get(block);
    }

    await ensurePlyrLoaded();

    const player = new window.Plyr(playerElement, {
        autoplay: autoplayMuted,
        muted: autoplayMuted,
        loop: { active: autoplayMuted },
        hideControls: autoplayMuted,
        youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
        },
    });

    registeredPlayers.add(player);
    playerMap.set(block, player);
    block.classList.add('is-player-loaded');

    wirePlayerEvents({
        player,
        block,
        playBtn,
        autoplayMuted,
        registeredPlayers,
    });

    if (autoplayMuted && unmuteBtn && !unmuteBtn.dataset.boundToPlayer) {
        unmuteBtn.dataset.boundToPlayer = '1';

        unmuteBtn.addEventListener('click', () => {
            player.muted = !player.muted;

            if (!player.muted) {
                unmuteBtn.classList.add('is-unmuted');
                player.volume = 0.8;
            } else {
                unmuteBtn.classList.remove('is-unmuted');
            }
        });
    }

    return player;
}

function initVideoYoutube() {
    const { registeredPlayers, playerMap } = ensureGlobalStores();
    const videoBlocks = document.querySelectorAll('.video-mp4');
    let hasClickToPlayBlocks = false;

    videoBlocks.forEach((block) => {
        if (block.dataset.videoYoutubeInitialized === '1') {
            return;
        }
        block.dataset.videoYoutubeInitialized = '1';

        const playerElement = block.querySelector('.js-player');
        const unmuteBtn = block.querySelector('.js-audio-toggle');
        const playBtn = block.querySelector('.js-video-play-btn');

        if (!playerElement) return;

        const autoplayMuted = playerElement.dataset.autoplayMuted === '1';
        hasClickToPlayBlocks = hasClickToPlayBlocks || !autoplayMuted;

        block.classList.toggle('is-click-to-play', !autoplayMuted);
        block.classList.toggle('is-autoplay-muted', autoplayMuted);
        block.classList.remove('is-playing');
        block.classList.add('is-paused');

        if (autoplayMuted) {
            createPlayerForBlock({
                block,
                playerElement,
                playBtn,
                unmuteBtn,
                autoplayMuted,
                registeredPlayers,
                playerMap,
            }).then((player) => {
                player.on('ready', () => {
                    player.play();
                });
            });
            return;
        }

        if (!playBtn) return;

        playBtn.addEventListener('click', async () => {
            playBtn.disabled = true;
            const isFirstLoad = !playerMap.has(block);

            const player = await createPlayerForBlock({
                block,
                playerElement,
                playBtn,
                unmuteBtn,
                autoplayMuted,
                registeredPlayers,
                playerMap,
            });

            block.classList.remove('is-paused');
            block.classList.add('is-playing');

            if (isFirstLoad) {
                let playedFromReady = false;
                player.on('ready', async () => {
                    if (playedFromReady) return;
                    playedFromReady = true;

                    try {
                        await player.play();
                    } catch (_error) {
                        // Ignore; user can still use native player controls if browser blocks playback.
                    }
                });
            }

            try {
                await player.play();
            } catch (_error) {
                // First-click lazy load may race player readiness; ready handler above will retry.
            } finally {
                playBtn.disabled = false;
            }
        });
    });

    if (hasClickToPlayBlocks) {
        ensurePlyrLoaded().catch(() => {
            // No-op: load will be retried when user interacts.
        });
    }
}

// Initialize immediately (for dynamic imports)
initVideoYoutube();