const DomDelegate = require('ftdomdelegate');
const HierarchicalNav = require('o-hierarchical-nav');

function Header(rootEl) {

	let bodyDelegate;
	// Gets all nav elements in the header
	const hierarchicalNavEls = [
		rootEl.querySelector('.o-techdocs-header__nav--primary-theme'),
		rootEl.querySelector('.o-techdocs-header__nav--secondary-theme'),
		rootEl.querySelector('.o-techdocs-header__nav--tools-theme')
	].filter(function(el) {
		/**
		 * Overflow is hidden by default on the tools and primary theme for it to resize properly on core experience
		 * where level 2 and 3 menus won't appear anyway, but in primary experience they do need to appear. We do this
		 * here instead of the map function in init because this needs to be applied regardless of the nav having been
		 * initialized previously, like when the o.DOMContententLoaded event is dispatched
		 */
		if (el) {
			el.style.overflow = 'visible';
		}
		return el && el.nodeType === 1 && !el.hasAttribute('data-o-hierarchical-nav--js');
	});
	let hierarchicalNavs = [];

	function init() {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		rootEl.setAttribute('data-o-techdocs-header--js', '');
		bodyDelegate = new DomDelegate(document.body);
		hierarchicalNavs = hierarchicalNavEls.map(function(el) {
			return new HierarchicalNav(el);
		});
	}

	// Release header and all its navs from memory
	function destroy() {
		bodyDelegate.destroy();
		for (let c = 0, l = hierarchicalNavs.length; c < l; c++) {
			if (hierarchicalNavs[c]) {
				hierarchicalNavs[c].destroy();
			}
		}
		rootEl.removeAttribute('data-o-techdocs-header--js');
	}

	init();

	this.destroy = destroy;

}

// Initializes all header elements in the page or whatever element is passed to it
Header.init = function(el) {
	if (!el) {
		el = document.body;
	} else if (!(el instanceof HTMLElement)) {
		el = document.querySelector(el);
	}
	const headerEls = el.querySelectorAll('[data-o-component="o-techdocs-header"]');
	const headers = [];
	for (let c = 0, l = headerEls.length; c < l; c++) {
		if (!headerEls[c].hasAttribute('data-o-techdocs-header--js')) {
			headers.push(new Header(headerEls[c]));
		}
	}
	return headers;
};

module.exports = { Header };
