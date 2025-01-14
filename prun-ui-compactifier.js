// ==UserScript==
// @name         PrUn UI Compactifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adjust styles for Prosperous Universe to make certain UI elements more compact, with toggles for each of its tweaks
// @author       fishmodem
// @match        https://apex.prosperousuniverse.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/fishmodem/prun-ui-compactifier/refs/heads/main/prun-ui-compactifier.js
// @downloadURL  https://raw.githubusercontent.com/fishmodem/prun-ui-compactifier/refs/heads/main/prun-ui-compactifier.js
// ==/UserScript==


(function() {
    'use strict';

    /****************************************************************
     * Control panel: Set any module's property to false to disable
     ****************************************************************/
    const ENABLED_MODULES = {
        shrinkResourceIcons: true,           // From 48px to 32px, as well as shrinking the padding between icons
        inventoryGridTweaks: true,           // Makes inventory icons left-aligned instead of justified
        pmmgBrnSortModeCategoryBars: true,   // Makes the category headers in PMMG's BRN sort mode smaller
        buttonStyling: true,                 // Makes buttons smaller, rounds the corners, and changes label colors to make them more readable
        productionViewTweaks: true,          // Shrinks production font, as well as making the New Order and Details buttons wider
        apexTilingTweaks: true,              // Removes gaps between panels
        pmmgGraphPadding: true,              // Trims unnecessary whitespace from PMMG and Refined Prun equity graphs so they fit in small windows
        materialsRoundedCorners: true,       // Rounds the corners of materials in all commands (6px border-radius)
        lowerProductionDisplayWidth: true    // (Experimental, uses JS not CSS) Decrease min-width of columns in production view (from 7rem to 6rem)
    };

    /****************************************************************
     * Define modules as objects with optional css & init() method
     ****************************************************************/
    const MODULES = {
        shrinkResourceIcons: {
            css: `
                /* Inventory grid modifications */
                [class^="StoreView__container"] [class^="GridItemView__container"] {
                    width: 32px !important;
                    margin: 2px !important;
                    margin-bottom: -2px !important;
                }
                [class^="StoreView__container"] [class^="GridItemView__image"] {
                    width: 32px !important;
                    height: 32px !important;
                }
                [class^="StoreView__container"] [class^="GridItemView__name"] {
                    font-size: 7px !important;
                    font-family: Verdana, sans-serif !important;
                    display: none !important;
                }
                [class^="StoreView__container"] [class^="MaterialIcon__container"] {
                    width: 32px !important;
                    height: 32px !important;
                }
                [class^="StoreView__container"] [class^="ColoredIcon__container"] {
                    width: 32px !important;
                    height: 32px !important;
                }
                [class^="StoreView__container"] [class^="ColoredIcon__label"] {
                    font-size: 10px !important;
                    font-weight: bolder !important;
                    color: #fff !important;
                }
                [class^="StoreView__container"] [class^="ColoredIcon__labelContainer"] {
                    height: 86% !important;
                }
                [class^="StoreView__container"] [class^="MaterialIcon__type-very-small"] {
                    font-size: 7px !important;
                }
                [class^="StoreView__container"] [class^="MaterialIcon__indicator"] {
                    background-color: transparent !important;
                    color: #fff !important;
                }
            `,
            init: null
        },

        inventoryGridTweaks: {
            css: `
                /* Inventory Grid Tweaks */
                [class^="StoreView__container"] [class^="InventoryView__grid"] {
                    justify-content: flex-start !important;
                    align-content: flex-start !important;
                    flex-wrap: wrap !important;
                }
            `,
            init: null
        },

        pmmgBrnSortModeCategoryBars: {
            css: `
                /* PMMG BRN Sort Mode Category Bars */
                [class^="InventoryView__grid"] [class^="Sidebar__sectionHead"] {
                    font-size: 8px !important;
                    font-weight: bolder !important;
                    margin: 2px 2px -5px !important;
                    padding: 2px 1px 1px !important;
                    background-color: transparent !important;
                }
            `,
            init: null
        },

        buttonStyling: {
            css: `
                /* Button Styling */
                [class*="Button__btn"] {
                    font-size: 9px !important;
                    margin: 1px !important;
                    padding: 2px 4px 0px !important;
                    border-radius: 2px !important;
                    color: #333 !important;
                    text-transform: lowercase !important;
                    line-height: unset !important;
                }
                [class*="Button__btn"]:first-letter {
                    text-transform: uppercase !important;
                }
                [class^="Button__primary"] {
                    color: #333 !important;
                }
                [class*="Button__dark"] {
                    color: #aaa !important;
                }
                [class^="Button__darkInline"] {
                    color: #aaa !important;
                }
                [class^="Button__disabled"] {
                    color: #888 !important;
                }
                [class^="ActionBar__element"] {
                    margin: auto 0px !important;
                    padding-top: 0px !important;
                }
                [class^="ActionBar__container"] {
                    padding: 2px 0 !important;
                }
            `,
            init: null
        },

        productionViewTweaks: {
            css: `
                /* Production view tweaks */
                [class^="SiteProductionLines__headerActions"] {
                    align-items: unset !important;
                    border-top: unset !important;
                    padding: unset !important;
                }
                [class^="SiteProductionLines__headerName"] {
                    padding: 2px 2px !important;
                }
                [class^="SiteProductionLines__headerActions"] [class^="Button__primary"] {
                    margin-left: 0px !important;
                }
                [class^="OrderSlot__info"] {
                    font-size: 8px !important;
                }
                /*[class^="OrderStatus__inProgress"] {
                    display: none;
                }*/
            `,
            init: null
        },

        apexTilingTweaks: {
            css: `
                /* APEX Tiling Tweaks */
                [class^="Tile__tile"] {
                    margin: 0px !important;
                    box-shadow: unset !important;
                    border: 1px solid #2a4a5d !important;
                }
                /*
                [class^="MainState__tileContainer"] {
                    margin: 0px !important;
                }
                */
            `,
            init: null
        },

        pmmgGraphPadding: {
            css: `
                /* Reduce padding on PMMG graphs */
                .js-plotly-plot {
                    margin-left: -25px;
                    margin-top: -5px;
                }
                /* On Refined Prun graphs */
                [class^="rp-RangeInput__input"] {
                    margin: 0px;
                }
            `,
            init: null
        },

        materialsRoundedCorners: {
            css: `
                /* Add rounded corners to materials */
                [class^="ColoredIcon__container"] {
                    border-radius: 6px !important;
                }
                [class*="effects__insetShadow"] {
                    border-radius: 6px !important;
                }
            `,
            init: null
        },

        lowerProductionDisplayWidth: {
            css: '',
            init: function() {
                // Only attach the observer if this module is enabled
                function adjustGridTemplateColumns(element) {
                    const gridStyle = element.style.gridTemplateColumns;
                    if (gridStyle && gridStyle.includes("minmax(7rem")) {
                        element.style.gridTemplateColumns = gridStyle.replace(
                            /minmax\((7rem),([^)]+)\)/,
                            "minmax(5.25rem,$2)"
                        );
                    }
                }

                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (
                            mutation.type === 'attributes' &&
                            mutation.target.matches('[class^="SiteProductionLines__grid"]')
                        ) {
                            adjustGridTemplateColumns(mutation.target);
                        }
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (
                                    node.nodeType === 1 &&
                                    node.matches('[class^="SiteProductionLines__grid"]')
                                ) {
                                    adjustGridTemplateColumns(node);
                                }
                            });
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true, attributes: true });

                // Adjust existing grids on page load
                document
                    .querySelectorAll('[class^="SiteProductionLines__grid"]')
                    .forEach(adjustGridTemplateColumns);

                // Periodic fallback
                setInterval(() => {
                    document
                        .querySelectorAll('[class^="SiteProductionLines__grid"]')
                        .forEach(adjustGridTemplateColumns);
                }, 500);
            }
        }
    };

    /****************************************************************
     * Gather all enabled modules, build styles, and run init if any
     ****************************************************************/
    let combinedStyles = '';

    Object.entries(MODULES).forEach(([moduleName, mod]) => {
        if (!ENABLED_MODULES[moduleName]) return; // skip disabled modules

        if (mod.css) {
            combinedStyles += mod.css;
        }
        if (typeof mod.init === 'function') {
            mod.init();
        }
    });

    if (combinedStyles.trim()) {
        const style = document.createElement('style');
        style.textContent = combinedStyles;
        document.head.appendChild(style);
    }
})();
