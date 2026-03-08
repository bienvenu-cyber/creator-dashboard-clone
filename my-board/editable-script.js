(function() {
    'use strict';

    const CONFIG = {
        storageKeyPrefix: 'of_edit_',
        bgEditing: 'rgba(0, 175, 240, 0.15)',
        hoverBorder: '2px dashed #00aff0',
        excludeTags: ['SCRIPT', 'STYLE', 'BUTTON', 'NOSCRIPT', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'G']
    };

    function getElementKey(el) {
        const path = getElementPath(el);
        const text = el.textContent.trim().substring(0, 30);
        return `${CONFIG.storageKeyPrefix}${path}_${hashCode(text)}`;
    }

    function getElementPath(el) {
        const path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                let sibling = el;
                let nth = 1;
                while (sibling.previousElementSibling) {
                    sibling = sibling.previousElementSibling;
                    if (sibling.nodeName.toLowerCase() === selector) nth++;
                }
                if (nth > 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join('>');
    }

    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function saveValue(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error("Erreur localStorage:", e);
        }
    }

    function loadValue(key) {
        return localStorage.getItem(key);
    }

    function isTextNode(el) {
        if (!el || !el.childNodes) return false;
        for (let node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                return true;
            }
        }
        return false;
    }

    function isEligible(el) {
        if (!el || !el.tagName) return false;
        if (CONFIG.excludeTags.includes(el.tagName)) return false;
        if (el.contentEditable === 'true') return false;
        if (el.isContentEditable) return false;
        
        const text = el.textContent.trim();
        if (text.length === 0 || text.length > 200) return false;
        
        // Accepte les éléments avec du texte direct ou un seul niveau d'enfants
        const hasDirectText = isTextNode(el);
        const hasSimpleChildren = el.children.length > 0 && el.children.length <= 3;
        
        return hasDirectText || hasSimpleChildren;
    }

    function makeEditable(el) {
        if (el.dataset.editablePowered) return;
        
        const key = getElementKey(el);
        const savedValue = loadValue(key);

        if (savedValue !== null) {
            el.textContent = savedValue;
        }

        el.dataset.editablePowered = "true";
        el.contentEditable = "true";
        el.style.cursor = "text";
        el.style.transition = "all 0.2s ease";

        el.addEventListener('mouseenter', () => {
            if (document.activeElement !== el) {
                el.style.outline = CONFIG.hoverBorder;
                el.style.outlineOffset = "2px";
            }
        });

        el.addEventListener('mouseleave', () => {
            if (document.activeElement !== el) {
                el.style.outline = "none";
            }
        });

        el.addEventListener('focus', () => {
            el.style.backgroundColor = CONFIG.bgEditing;
            el.style.outline = CONFIG.hoverBorder;
            el.style.outlineOffset = "2px";
        });

        el.addEventListener('blur', () => {
            el.style.backgroundColor = "";
            el.style.outline = "none";
            saveValue(key, el.textContent);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                el.blur();
            }
        });
    }

    function scanAndMakeEditable() {
        console.log("🔍 Scan des éléments éditables...");
        
        // Cible les éléments contenant du texte/chiffres
        const selectors = [
            'span:not([data-editable-powered])',
            'div:not([data-editable-powered])',
            'p:not([data-editable-powered])',
            'td:not([data-editable-powered])',
            'th:not([data-editable-powered])',
            'h1:not([data-editable-powered])',
            'h2:not([data-editable-powered])',
            'h3:not([data-editable-powered])',
            'h4:not([data-editable-powered])',
            'a:not([data-editable-powered])',
            'label:not([data-editable-powered])',
            'strong:not([data-editable-powered])',
            'b:not([data-editable-powered])'
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        let count = 0;
        
        elements.forEach(el => {
            if (isEligible(el)) {
                makeEditable(el);
                count++;
            }
        });
        
        console.log(`✅ ${count} éléments rendus éditables`);
    }

    // Les graphiques Highcharts ne sont pas éditables avec cette approche
    // Pour éditer les graphiques, il faudrait intercepter l'objet Highcharts
    // et modifier les données directement, ce qui est plus complexe

    // Observer pour les éléments ajoutés dynamiquement
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (isEligible(node)) makeEditable(node);
                    node.querySelectorAll?.('span, div, p, td, th, h1, h2, h3, a').forEach(el => {
                        if (isEligible(el)) makeEditable(el);
                    });
                }
            });
        });
    });

    // Initialisation
    function init() {
        console.log("⚡ Script d'édition OnlyFans chargé");
        scanAndMakeEditable();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }

    console.log("💡 Astuce: Double-cliquez sur n'importe quel texte ou nombre pour le modifier!");
})();
