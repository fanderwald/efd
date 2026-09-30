/**
 * Newsletter Drawer Component
 * Handles auto-opening, manual toggle, dismissal persistence with localStorage, and accessibility.
 */

const STORAGE_KEY = 'efd_newsletter_dismissed';

export function initNewsletterDrawer() {
	const drawer = document.getElementById('efd-newsletter-drawer');
	if (!drawer) return;

	const trigger = document.getElementById('efd-newsletter-trigger');
	const panel = document.getElementById('efd-newsletter-panel');
	const closeBtn = document.getElementById('efd-newsletter-close');

	const autoDelaySec = parseFloat(drawer.dataset.autoDelay) || 4;
	const dismissDays = parseFloat(drawer.dataset.dismissDays) || 7;
	const dismissDurationMs = dismissDays * 24 * 60 * 60 * 1000;

	function isDismissed() {
		try {
			const dismissedTimestamp = localStorage.getItem(STORAGE_KEY);
			if (!dismissedTimestamp) return false;
			const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
			return elapsed < dismissDurationMs;
		} catch (e) {
			return false;
		}
	}

	function setDismissed() {
		try {
			localStorage.setItem(STORAGE_KEY, Date.now().toString());
		} catch (e) {
			// localStorage might be unavailable/blocked
		}
	}

	function openDrawer() {
		drawer.classList.add('is-open');
		if (trigger) trigger.setAttribute('aria-expanded', 'true');
		if (panel) panel.setAttribute('aria-hidden', 'false');

		// Focus email input or first focusable element
		const input = panel ? panel.querySelector('input[type="email"], input[type="text"]') : null;
		if (input) {
			input.focus();
		} else if (closeBtn) {
			closeBtn.focus();
		}
	}

	function closeDrawer(persistDismiss = true) {
		drawer.classList.remove('is-open');
		if (trigger) {
			trigger.setAttribute('aria-expanded', 'false');
			trigger.focus();
		}
		if (panel) panel.setAttribute('aria-hidden', 'true');

		if (persistDismiss) {
			setDismissed();
		}
	}

	// Trigger button click
	if (trigger) {
		trigger.addEventListener('click', () => {
			if (drawer.classList.contains('is-open')) {
				closeDrawer(false);
			} else {
				openDrawer();
			}
		});
	}

	// Close button click
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			closeDrawer(true);
		});
	}

	// Close on Escape key press if open
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
			closeDrawer(true);
		}
	});

	// Auto-expand after delay unless dismissed
	if (!isDismissed()) {
		setTimeout(() => {
			if (!drawer.classList.contains('is-open')) {
				openDrawer();
			}
		}, Math.max(100, autoDelaySec * 1000));
	}
}
