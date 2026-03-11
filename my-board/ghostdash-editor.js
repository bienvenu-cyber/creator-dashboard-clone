(function() {
    'use strict';

    const GHOSTDASH_THEME = {
        dark: '#1a1d29',
        darkSecondary: '#252936',
        royalBlue: '#4169e1',
        royalBlueHover: '#5a7fe6',
        text: '#e8eaed',
        textSecondary: '#9ca3af',
        border: '#3a3f52',
        success: '#10b981',
        danger: '#ef4444'
    };

    const STORAGE_KEY = 'ghostdash_page_data';

    // Créer le bouton flottant d'édition
    function createFloatingButton() {
        const buttonHTML = `
            <button id="ghostdash-edit-btn" class="ghostdash-floating-btn" title="Éditer la page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Ghostdash</span>
            </button>
        `;

        const styles = `
            <style id="ghostdash-floating-btn-styles">
                .ghostdash-floating-btn {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: ${GHOSTDASH_THEME.royalBlue};
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 24px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(65, 105, 225, 0.4);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .ghostdash-floating-btn:hover {
                    background: ${GHOSTDASH_THEME.royalBlueHover};
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(65, 105, 225, 0.5);
                }

                .ghostdash-floating-btn:active {
                    transform: translateY(0);
                }

                @media (max-width: 640px) {
                    .ghostdash-floating-btn {
                        bottom: 80px;
                        right: 16px;
                        padding: 12px 20px;
                        font-size: 14px;
                    }
                }
            </style>
        `;

        if (!document.getElementById('ghostdash-floating-btn-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }

        if (!document.getElementById('ghostdash-edit-btn')) {
            document.body.insertAdjacentHTML('beforeend', buttonHTML);
        }

        return document.getElementById('ghostdash-edit-btn');
    }

    // Créer le modal d'édition
    function createModal() {
        const modalHTML = `
            <div id="ghostdash-modal" class="ghostdash-modal">
                <div class="ghostdash-modal-overlay"></div>
                <div class="ghostdash-modal-content">
                    <div class="ghostdash-modal-header">
                        <div class="ghostdash-modal-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span>Éditer la page</span>
                        </div>
                        <button class="ghostdash-modal-close" aria-label="Fermer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="ghostdash-modal-body">
                        <div class="ghostdash-info-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Modifiez les valeurs ci-dessous. Les changements seront sauvegardés localement.</span>
                        </div>
                        <form id="ghostdash-form">
                            <div id="ghostdash-fields"></div>
                            <div class="ghostdash-modal-actions">
                                <button type="button" class="ghostdash-btn ghostdash-btn-secondary" id="ghostdash-cancel">
                                    Annuler
                                </button>
                                <button type="button" class="ghostdash-btn ghostdash-btn-danger" id="ghostdash-reset">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="1 4 1 10 7 10"></polyline>
                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                    </svg>
                                    Réinitialiser
                                </button>
                                <button type="submit" class="ghostdash-btn ghostdash-btn-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const modalStyles = `
            <style id="ghostdash-modal-styles">
                .ghostdash-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: ghostdash-fadeIn 0.2s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .ghostdash-modal.active {
                    display: flex;
                }

                .ghostdash-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(4px);
                }

                .ghostdash-modal-content {
                    position: relative;
                    background: ${GHOSTDASH_THEME.dark};
                    border: 1px solid ${GHOSTDASH_THEME.border};
                    border-radius: 12px;
                    max-width: 700px;
                    width: 100%;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: ghostdash-slideUp 0.3s ease;
                }

                .ghostdash-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid ${GHOSTDASH_THEME.border};
                    background: ${GHOSTDASH_THEME.darkSecondary};
                }

                .ghostdash-modal-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: ${GHOSTDASH_THEME.text};
                    font-size: 18px;
                    font-weight: 600;
                }

                .ghostdash-modal-title svg {
                    color: ${GHOSTDASH_THEME.royalBlue};
                }

                .ghostdash-modal-close {
                    background: transparent;
                    border: none;
                    color: ${GHOSTDASH_THEME.textSecondary};
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ghostdash-modal-close:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: ${GHOSTDASH_THEME.text};
                }

                .ghostdash-modal-body {
                    padding: 24px;
                    overflow-y: auto;
                    max-height: calc(90vh - 140px);
                }

                .ghostdash-info-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 16px;
                    background: rgba(65, 105, 225, 0.1);
                    border: 1px solid rgba(65, 105, 225, 0.3);
                    border-radius: 8px;
                    color: ${GHOSTDASH_THEME.textSecondary};
                    font-size: 14px;
                    margin-bottom: 24px;
                }

                .ghostdash-info-banner svg {
                    color: ${GHOSTDASH_THEME.royalBlue};
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .ghostdash-field-group {
                    margin-bottom: 20px;
                }

                .ghostdash-field-label {
                    display: block;
                    color: ${GHOSTDASH_THEME.text};
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .ghostdash-field-label-path {
                    display: block;
                    color: ${GHOSTDASH_THEME.textSecondary};
                    font-size: 11px;
                    font-weight: 400;
                    margin-top: 2px;
                    font-family: 'Monaco', 'Courier New', monospace;
                }

                .ghostdash-field-input {
                    width: 100%;
                    padding: 12px 16px;
                    background: ${GHOSTDASH_THEME.darkSecondary};
                    border: 1px solid ${GHOSTDASH_THEME.border};
                    border-radius: 8px;
                    color: ${GHOSTDASH_THEME.text};
                    font-size: 14px;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }

                .ghostdash-field-input:focus {
                    outline: none;
                    border-color: ${GHOSTDASH_THEME.royalBlue};
                    box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.1);
                }

                .ghostdash-field-input::placeholder {
                    color: ${GHOSTDASH_THEME.textSecondary};
                }

                .ghostdash-modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid ${GHOSTDASH_THEME.border};
                }

                .ghostdash-btn {
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ghostdash-btn-primary {
                    background: ${GHOSTDASH_THEME.royalBlue};
                    color: white;
                }

                .ghostdash-btn-primary:hover {
                    background: ${GHOSTDASH_THEME.royalBlueHover};
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(65, 105, 225, 0.3);
                }

                .ghostdash-btn-secondary {
                    background: transparent;
                    color: ${GHOSTDASH_THEME.textSecondary};
                    border: 1px solid ${GHOSTDASH_THEME.border};
                }

                .ghostdash-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: ${GHOSTDASH_THEME.text};
                }

                .ghostdash-btn-danger {
                    background: transparent;
                    color: ${GHOSTDASH_THEME.danger};
                    border: 1px solid ${GHOSTDASH_THEME.danger};
                }

                .ghostdash-btn-danger:hover {
                    background: ${GHOSTDASH_THEME.danger};
                    color: white;
                }

                @keyframes ghostdash-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes ghostdash-slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 640px) {
                    .ghostdash-modal-content {
                        max-width: 100%;
                        margin: 0;
                        border-radius: 12px 12px 0 0;
                        max-height: 95vh;
                    }

                    .ghostdash-modal {
                        align-items: flex-end;
                        padding: 0;
                    }

                    .ghostdash-modal-actions {
                        flex-direction: column-reverse;
                    }

                    .ghostdash-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
        `;

        if (!document.getElementById('ghostdash-modal-styles')) {
            document.head.insertAdjacentHTML('beforeend', modalStyles);
        }

        if (!document.getElementById('ghostdash-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        return document.getElementById('ghostdash-modal');
    }

    // Scanner tous les éléments éditables
    function scanEditableElements() {
        const elements = [];
        const selectors = [
            'span', 'div', 'p', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'a', 'label', 'strong', 'b'
        ];

        document.querySelectorAll(selectors.join(',')).forEach((el, index) => {
            const text = el.textContent.trim();
            
            // Ignorer les éléments vides, trop longs, ou dans des scripts
            if (!text || text.length > 200 || text.length < 1) return;
            if (el.closest('script, style, noscript')) return;
            
            // Vérifier si c'est un montant, pourcentage, ou nombre
            const isNumber = /[\d$€£¥%,.]/.test(text);
            const isAmount = /\$|€|£|¥/.test(text);
            const isPercent = /%/.test(text);
            
            if (isNumber || isAmount || isPercent || text.length < 50) {
                const path = getElementPath(el);
                elements.push({
                    element: el,
                    text: text,
                    path: path,
                    key: `field_${index}`,
                    type: isAmount ? 'amount' : isPercent ? 'percent' : isNumber ? 'number' : 'text'
                });
            }
        });

        return elements;
    }

    // Obtenir le chemin d'un élément
    function getElementPath(el) {
        const path = [];
        let current = el;
        let depth = 0;
        
        while (current && current.nodeType === Node.ELEMENT_NODE && depth < 5) {
            let selector = current.nodeName.toLowerCase();
            if (current.id) {
                selector += '#' + current.id;
                path.unshift(selector);
                break;
            } else if (current.className && typeof current.className === 'string') {
                const classes = current.className.split(' ').filter(c => c && !c.startsWith('ghostdash'));
                if (classes.length > 0) {
                    selector += '.' + classes[0];
                }
            }
            path.unshift(selector);
            current = current.parentNode;
            depth++;
        }
        
        return path.join(' > ');
    }

    // Ouvrir le modal
    function openModal() {
        const modal = createModal();
        const fieldsContainer = document.getElementById('ghostdash-fields');
        const form = document.getElementById('ghostdash-form');

        // Scanner les éléments
        const elements = scanEditableElements();
        console.log(`📝 ${elements.length} éléments éditables trouvés`);

        // Charger les données sauvegardées
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

        // Générer les champs
        fieldsContainer.innerHTML = '';
        elements.forEach((item) => {
            const savedValue = savedData[item.key];
            const value = savedValue !== undefined ? savedValue : item.text;
            
            const fieldHTML = `
                <div class="ghostdash-field-group">
                    <label class="ghostdash-field-label">
                        ${item.text}
                        <span class="ghostdash-field-label-path">${item.path}</span>
                    </label>
                    <input 
                        type="text"
                        class="ghostdash-field-input" 
                        name="${item.key}"
                        value="${value.replace(/"/g, '&quot;')}"
                        placeholder="Entrez une valeur"
                        data-original="${item.text.replace(/"/g, '&quot;')}"
                    />
                </div>
            `;
            fieldsContainer.insertAdjacentHTML('beforeend', fieldHTML);
        });

        // Afficher le modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Gérer la fermeture
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modal.querySelector('.ghostdash-modal-close').onclick = closeModal;
        modal.querySelector('.ghostdash-modal-overlay').onclick = closeModal;
        document.getElementById('ghostdash-cancel').onclick = closeModal;

        // Gérer la réinitialisation
        document.getElementById('ghostdash-reset').onclick = () => {
            if (confirm('Voulez-vous vraiment réinitialiser toutes les valeurs?')) {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        };

        // Gérer la soumission
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newData = {};

            elements.forEach((item, index) => {
                const newValue = formData.get(item.key);
                newData[item.key] = newValue;
                item.element.textContent = newValue;
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            closeModal();
            showNotification('✅ Modifications enregistrées avec succès!');
        };

        // Focus sur le premier champ
        setTimeout(() => {
            fieldsContainer.querySelector('input')?.focus();
        }, 100);
    }

    // Notification toast
    function showNotification(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: ${GHOSTDASH_THEME.success};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: ghostdash-slideUp 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'ghostdash-fadeIn 0.2s ease reverse';
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    }

    // Appliquer les données sauvegardées au chargement
    function applyS avedData() {
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const elements = scanEditableElements();
        
        let appliedCount = 0;
        elements.forEach((item) => {
            if (savedData[item.key] !== undefined) {
                item.element.textContent = savedData[item.key];
                appliedCount++;
            }
        });

        if (appliedCount > 0) {
            console.log(`✅ ${appliedCount} valeurs restaurées depuis la sauvegarde`);
        }
    }

    // Initialiser
    function init() {
        console.log('💎 Ghostdash Editor chargé');
        
        // Créer le bouton flottant
        const btn = createFloatingButton();
        btn.onclick = openModal;

        // Appliquer les données sauvegardées
        applyS avedData();
        
        console.log('✅ Ghostdash Editor prêt! Cliquez sur le bouton "Éditer" pour commencer.');
    }

    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }
})();
