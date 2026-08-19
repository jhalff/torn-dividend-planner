// ==UserScript==
// @name         TORN Dividend Planner
// @namespace    https://github.com/jhalff/torn-dividend-planner
// @version      1.0.25
// @description  Build and manage TORN stock dividend combinations
// @author       Draxeth
// @match        https://www.torn.com/page.php*
// @include      https://www.torn.com/page.php?sid=stocks*
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/jhalff/torn-dividend-planner/main/script.user.js
// @supportURL   https://github.com/jhalff/torn-dividend-planner/issues
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STOCK_SELECTOR = '[data-name="nameTab"]';
    const CONTAINER_SELECTOR = '[class*="stockMarket___"], [data-testid*="stock-market" i]';

    if (new URL(window.location.href).searchParams.get('sid') !== 'stocks') {
        return;
    }

    const BENEFIT_SHARES = {
        ASS: 1_000_000,
        BAG: 3_000_000,
        CNC: 7_500_000,
        EWM: 1_000_000,
        ELT: 5_000_000,
        EVL: 100_000,
        FHG: 2_000_000,
        GRN: 500_000,
        CBD: 350_000,
        HRG: 10_000_000,
        IIL: 1_000_000,
        IOU: 3_000_000,
        IST: 100_000,
        LAG: 750_000,
        LOS: 7_500_000,
        LSC: 500_000,
        MCS: 350_000,
        MSG: 300_000,
        MUN: 5_000_000,
        PRN: 1_000_000,
        PTS: 10_000_000,
        SYM: 500_000,
        SYS: 3_000_000,
        TCP: 1_000_000,
        TMI: 6_000_000,
        TGP: 2_500_000,
        TCT: 100_000,
        TSB: 3_000_000,
        TCC: 7_500_000,
        THS: 150_000,
        TCI: 1_500_000,
        TCM: 1_000_000,
        WSU: 1_000_000,
        WLT: 9_000_000,
        YAZ: 1_000_000
    };

    let manager = null;
    let selectedStocks = [];

    function parseNumber(value) {
        if (!value) {
            return 0;
        }

        return parseFloat(value.replace(/[$,]/g, '').trim()) || 0;
    }

    function getStockData(stock) {
        const nameElement = stock.querySelector(
            '[data-name="nameTab"]'
        );

        const priceTab = stock.querySelector(
            '[data-name="priceTab"]'
        );

        const ownedTab = stock.querySelector(
            '[data-name="ownedTab"]'
        );

        const dividendTab = stock.querySelector(
            '[data-name="dividendTab"]'
        );

        if (!nameElement || !priceTab || !ownedTab) {
            return null;
        }

        const acronym = nameElement.dataset.acronym
            || nameElement.querySelector('[data-acronym]')?.dataset.acronym;

        if (!acronym) {
            return null;
        }

        const name = nameElement.textContent
            .replace(`(${acronym})`, '')
            .trim();

        /*
         * Price
         *
         * Example:
         * "391.86 $1.20 0.31%"
         *
         * The first number is always the stock price.
         */
        const priceMatch = priceTab.textContent.match(
            /\d+(?:\.\d+)/
        );

        const price = parseNumber(priceMatch?.[0]);

        /*
         * Owned shares
         *
         * TORN provides this very conveniently through
         * the aria-label:
         *
         * "Owned: 150000 shares"
         */
        const ownedLabel = ownedTab.getAttribute('aria-label') || '';

        const sharesMatch = ownedLabel.match(
            /Owned:\s*([\d,]+)\s*shares/i
        );

        const ownedShares = parseNumber(
            sharesMatch?.[1]
        );

        /*
         * Owned value
         *
         * Look for the dollar value directly inside the
         * owned tab.
         */
        const ownedValueMatch = ownedTab.textContent.match(
            /\$[\d,]+(?:\.\d+)?/
        );

        let ownedValue = parseNumber(
            ownedValueMatch?.[0]
        );

        /*
         * Fallback:
         *
         * If TORN hasn't exposed the value yet, calculate
         * it from the price and number of shares.
         */
        if (
            ownedValue === 0 &&
            ownedShares > 0 &&
            price > 0
        ) {
            ownedValue = price * ownedShares;
        }

        const benefit = dividendTab
            ?.querySelector('[class*="dividend"]')
            ?.textContent.trim()
            || dividendTab?.textContent.trim()
            || 'Unknown benefit';

        const benefitShares = BENEFIT_SHARES[acronym];

        const dividendCost = benefitShares
            ? price * benefitShares
            : null;

        return {
            element: stock,
            acronym,
            name,
            price,
            ownedValue,
            ownedShares,
            benefit,
            benefitShares,
            dividendCost
        };
    }

    function getStocks() {
        const stocks = [];

        document
            .querySelectorAll(STOCK_SELECTOR)
            .forEach(nameElement => {
                const stock = nameElement.closest('ul');

                if (!stock) {
                    return;
                }

                if (stocks.includes(stock)) {
                    return;
                }

                stocks.push(stock);
            });

        return stocks
            .map(getStockData)
            .filter(Boolean);
    }

    function getPortfolioValue(stocks) {
        return stocks.reduce(
            (total, stock) => total + stock.ownedValue,
            0
        );
    }

    function getSelectedCost() {
        return selectedStocks.reduce(
            (total, stock) => total + stock.dividendCost,
            0
        );
    }

    function getRemainingBudget(portfolioValue) {
        return portfolioValue - getSelectedCost();
    }

    function isSelected(stock) {
        return selectedStocks.some(
            selected => selected.acronym === stock.acronym
        );
    }

    function canAfford(stock, remainingBudget) {
        return (
            stock.dividendCost !== null &&
            stock.dividendCost > 0 &&
            stock.dividendCost <= remainingBudget
        );
    }

    function selectStock(stock) {
        if (isSelected(stock)) {
            return;
        }

        const stocks = getStocks();
        const portfolioValue = getPortfolioValue(stocks);
        const remainingBudget = getRemainingBudget(portfolioValue);

        if (!canAfford(stock, remainingBudget)) {
            return;
        }

        selectedStocks.push(stock);

        sortAndRender();
    }

    function removeStock(stock) {
        selectedStocks = selectedStocks.filter(
            selected => selected.acronym !== stock.acronym
        );

        sortAndRender();
    }

    function createManager() {
        const newManager = document.createElement('div');
        newManager.id = 'torn-dividend-manager';

        newManager.innerHTML = `
            <div class="tsm-header">
                <div class="tsm-header-title">
                    <strong>Dividend Planner</strong>
                    <span class="tsm-header-count"></span>
                    <span class="tsm-debug"></span>
                </div>

                <button
                    type="button"
                    class="tsm-toggle"
                    aria-label="Collapse stock manager"
                    aria-expanded="true"
                >
                    ▲
                </button>
            </div>

            <div class="tsm-content">
                <div class="tsm-portfolio">
                    <div class="tsm-portfolio-title">
                        Current portfolio value
                    </div>

                    <div class="tsm-portfolio-value">
                        $0
                    </div>

                    <div class="tsm-portfolio-remaining">
                        Available
                        <strong>$0</strong>
                    </div>
                </div>

                <div class="tsm-layout">
                    <div class="tsm-stocks-panel">
                        <div class="tsm-section-title">
                            Dividend stocks
                        </div>

                        <div class="tsm-list"></div>
                    </div>

                    <div class="tsm-right-panel">
                        <div class="tsm-combinations">
                            <div class="tsm-section-title">
                                Your combination
                            </div>

                            <div class="tsm-combination-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const stockMarket = document.querySelector(CONTAINER_SELECTOR)
            || document.querySelector(STOCK_SELECTOR)?.parentElement;

        if (!stockMarket?.parentElement) {
            return false;
        }

        manager = newManager;

        stockMarket.parentElement.insertBefore(
            manager,
            stockMarket
        );

        addStyles();

        const toggle = manager.querySelector('.tsm-toggle');

        toggle.addEventListener('click', () => {
            const collapsed = manager.classList.toggle('is-collapsed');

            toggle.textContent = collapsed ? '▼' : '▲';

            toggle.setAttribute(
                'aria-expanded',
                String(!collapsed)
            );

            toggle.setAttribute(
                'aria-label',
                collapsed
                    ? 'Expand stock manager'
                    : 'Collapse stock manager'
            );
        });

        return true;
    }

    function renderPortfolio(portfolioValue) {
        const valueElement = manager.querySelector('.tsm-portfolio-value');
        const remainingElement = manager.querySelector('.tsm-portfolio-remaining strong');

        const selectedCost = getSelectedCost();
        const remainingBudget = portfolioValue - selectedCost;

        valueElement.textContent = `$${Math.round(portfolioValue).toLocaleString()}`;
        remainingElement.textContent = `$${Math.round(remainingBudget).toLocaleString()}`;

        const portfolioElement = manager.querySelector('.tsm-portfolio');
        portfolioElement.classList.toggle('tsm-budget-negative', remainingBudget < 0);
    }

    function renderCombination() {
        const list = manager.querySelector('.tsm-combination-list');
        list.innerHTML = '';

        if (!selectedStocks.length) {
            list.innerHTML = `
                <div class="tsm-empty">
                    Select an affordable stock to build your combination.
                </div>
            `;

            return;
        }

        const totalCost = getSelectedCost();

        selectedStocks.forEach(stock => {
            const item = document.createElement('button');

            item.type = 'button';
            item.className = 'tsm-selected-stock';

            item.innerHTML = `
                <span class="tsm-selected-main">
                    <span class="tsm-selected-acronym">
                        ${stock.acronym}
                    </span>

                    <span class="tsm-selected-info">
                        <span class="tsm-selected-company">
                            ${stock.name}
                        </span>

                        <span class="tsm-selected-benefit">
                            ${stock.benefit}
                        </span>
                    </span>
                </span>

                <span class="tsm-selected-details">
                    <span class="tsm-selected-shares">
                        ${stock.benefitShares.toLocaleString()} shares
                    </span>

                    <span class="tsm-selected-cost">
                        $${Math.round(stock.dividendCost).toLocaleString()}
                    </span>
                </span>
            `;

            item.title = 'Click to remove from combination';

            item.addEventListener('click', () => {
                removeStock(stock);
            });

            list.appendChild(item);
        });

        const remaining = manager.querySelector('.tsm-combination-remaining');
        if (remaining) {
            remaining.remove();
        }

        const stocks = getStocks();
        const portfolioValue = getPortfolioValue(stocks);
        const remainingBudget = portfolioValue - totalCost;

        const summary = document.createElement('div');
        summary.className = 'tsm-combination-summary';
        summary.innerHTML = `
            <div>
                <span>Combination cost</span>
                <strong>
                    $${Math.round(totalCost).toLocaleString()}
                </strong>
            </div>

            <div class="tsm-combination-remaining">
                <span>Remaining</span>
                <strong>
                    $${Math.round(remainingBudget).toLocaleString()}
                </strong>
            </div>
        `;

        list.appendChild(summary);
    }

    function renderStocks(stocks, portfolioValue) {
        const list = manager.querySelector('.tsm-list');
        list.innerHTML = '';

        const count = manager.querySelector('.tsm-header-count');
        count.textContent = `${stocks.length} stocks`;

        const remainingBudget = getRemainingBudget(portfolioValue);

        stocks
            .filter(stock => !isSelected(stock))
            .forEach(stock => {
                const item = document.createElement('button');

                item.type = 'button';
                item.className = 'tsm-stock';

                const affordable = canAfford(stock, remainingBudget);
                if (affordable) {
                    item.classList.add('tsm-affordable');
                } else {
                    item.classList.add('tsm-unaffordable');
                }

                const cost = stock.dividendCost !== null
                    ? `$${Math.round(
                        stock.dividendCost
                    ).toLocaleString()}`
                    : 'N/A';

                const shares = stock.benefitShares !== null
                    ? `${stock.benefitShares.toLocaleString()} shares`
                    : 'No benefit data';

                item.innerHTML = `
                    <span class="tsm-acronym">
                        ${stock.acronym}
                    </span>

                    <span class="tsm-name">
                        <span class="tsm-company">
                            ${stock.name}
                        </span>

                        <span class="tsm-benefit">
                            ${stock.benefit}
                        </span>
                    </span>

                    <span class="tsm-details">
                        <span class="tsm-shares">
                            ${shares}
                        </span>

                        <span class="tsm-price">
                            ${cost}
                        </span>
                    </span>
                `;

                if (affordable) {
                    item.title = 'Click to add to combination';

                    item.addEventListener('click', () => {
                        selectStock(stock);
                    });
                } else {
                    item.title = 'Not enough funds';
                    item.disabled = true;
                }

                list.appendChild(item);
            });
    }

    function sortAndRender() {
        const stocks = getStocks();
        if (!stocks.length || !manager) {
            return;
        }

        stocks.sort((a, b) => {
            if (a.dividendCost === null) {
                return 1;
            }

            if (b.dividendCost === null) {
                return -1;
            }

            return a.dividendCost - b.dividendCost;
        });

        const portfolioValue = getPortfolioValue(stocks);

        renderPortfolio(portfolioValue);
        renderCombination();
        renderStocks(stocks, portfolioValue);
    }

    function addStyles() {
        const style = document.createElement('style');

        style.textContent = `
            #torn-dividend-manager {
                margin-bottom: 10px;
                background: #242424;
                border-radius: 4px;
                overflow: hidden;
            }

            #torn-dividend-manager .tsm-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                background: #303030;
                color: #ddd;
                font-size: 14px;
            }

            #torn-dividend-manager .tsm-header-title {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }

            #torn-dividend-manager .tsm-header-count {
                color: #888;
                font-size: 12px;
            }

            #torn-dividend-manager .tsm-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                padding: 0;
                border: 0;
                border-radius: 3px;
                background: #3a3a3a;
                color: #aaa;
                font-size: 10px;
                cursor: pointer;
            }

            #torn-dividend-manager .tsm-toggle:hover {
                background: #525252;
                color: #fff;
            }

            #torn-dividend-manager .tsm-content {
                display: block;
            }

            #torn-dividend-manager.is-collapsed .tsm-content {
                display: none;
            }

            #torn-dividend-manager .tsm-layout {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                align-items: start;
            }

            #torn-dividend-manager .tsm-stocks-panel {
                min-width: 0;
                border-right: 1px solid #333;
            }

            #torn-dividend-manager .tsm-right-panel {
                min-width: 0;
            }

            #torn-dividend-manager .tsm-portfolio {
                background: #292929;
                border-bottom: 1px solid #333;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 9px 12px;
            }

            #torn-dividend-manager .tsm-portfolio-title {
                color: #aaa;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }

            #torn-dividend-manager .tsm-portfolio-value {
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                font-variant-numeric: tabular-nums;
            }

            #torn-dividend-manager .tsm-portfolio-remaining {
                margin-left: auto;
                color: #777;
                font-size: 11px;
                font-variant-numeric: tabular-nums;
            }

            #torn-dividend-manager .tsm-portfolio-remaining strong {
                color: #aaa;
            }

            #torn-dividend-manager .tsm-budget-negative {
                background: #3a2424;
            }

            #torn-dividend-manager .tsm-combination {
                padding: 9px 12px;
                border-bottom: 1px solid #333;
            }

            #torn-dividend-manager .tsm-combination-list {
                height: 600px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            #torn-dividend-manager .tsm-empty {
                padding: 12px;
                color: #777;
                font-size: 12px;
                line-height: 1.5;
            }

            #torn-dividend-manager .tsm-selected-stock {
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;
                gap: 8px;
                width: 100%;
                padding: 9px 12px;
                border: 0;
                border-bottom: 1px solid #333;
                background: transparent;
                color: #ccc;
                text-align: left;
                cursor: pointer;
            }

            #torn-dividend-manager .tsm-selected-stock:hover {
                background: #333;
            }

            #torn-dividend-manager .tsm-selected-main {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }

            #torn-dividend-manager .tsm-selected-acronym {
                color: #8fc98f;
                font-weight: bold;
            }

            #torn-dividend-manager .tsm-selected-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }

            #torn-dividend-manager .tsm-selected-company {
                color: #ccc;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-selected-benefit {
                color: #8f8f8f;
                font-size: 11px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-selected-details {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
            }

            #torn-dividend-manager .tsm-selected-shares {
                color: #777;
                font-size: 10px;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-selected-cost {
                color: #fff;
                font-size: 12px;
                font-variant-numeric: tabular-nums;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-combination-summary {
                padding: 10px 12px;
                border-top: 1px solid #333;
                background: #292929;
                color: #777;
                font-size: 11px;
            }

            #torn-dividend-manager .tsm-combination-summary > div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            #torn-dividend-manager .tsm-combination-summary strong {
                color: #fff;
                font-variant-numeric: tabular-nums;
            }

            #torn-dividend-manager .tsm-combination-remaining {
                margin-top: 4px;
            }

            #torn-dividend-manager .tsm-stocks-panel,
            #torn-dividend-manager .tsm-right-panel {
                min-width: 0;
                max-width: 100%;
            }

            #torn-dividend-manager .tsm-stock {
                display: grid;
                grid-template-columns: 55px 1fr auto;
                align-items: center;
                gap: 8px;
                width: 100%;
                padding: 7px 12px;
                border: 0;
                border-bottom: 1px solid #333;
                background: transparent;
                color: #ccc;
                text-align: left;
                cursor: pointer;
                transition: background 0.1s ease;
            }

            #torn-dividend-manager .tsm-stock:hover {
                background: #333;
            }

            #torn-dividend-manager .tsm-stock:disabled {
                cursor: not-allowed;
            }

            #torn-dividend-manager .tsm-stock.tsm-affordable {
                background: rgba(70, 130, 70, 0.08);
            }

            #torn-dividend-manager .tsm-stock.tsm-affordable:hover {
                background: rgba(70, 130, 70, 0.20);
            }

            #torn-dividend-manager .tsm-stock.tsm-unaffordable {
                background: rgba(130, 55, 55, 0.08);
                opacity: 0.65;
            }

            #torn-dividend-manager .tsm-stock.tsm-selected {
                background: rgba(70, 110, 70, 0.22);
                box-shadow: inset 3px 0 0 #6fa66f;
            }

            #torn-dividend-manager .tsm-stock.tsm-selected:hover {
                background: rgba(70, 110, 70, 0.30);
            }

            #torn-dividend-manager .tsm-acronym {
                color: #aaa;
                font-weight: bold;
            }

            #torn-dividend-manager .tsm-affordable .tsm-acronym {
                color: #8fc98f;
            }

            #torn-dividend-manager .tsm-unaffordable .tsm-acronym {
                color: #c47b7b;
            }

            #torn-dividend-manager .tsm-selected .tsm-acronym {
                color: #8fc98f;
            }

            #torn-dividend-manager .tsm-name {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }

            #torn-dividend-manager .tsm-company {
                color: #ccc;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-benefit {
                color: #8f8f8f;
                font-size: 11px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-details {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
            }

            #torn-dividend-manager .tsm-shares {
                color: #777;
                font-size: 10px;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-price {
                color: #fff;
                font-size: 12px;
                font-variant-numeric: tabular-nums;
                white-space: nowrap;
            }

            #torn-dividend-manager .tsm-unaffordable .tsm-price {
                color: #b87878;
            }

            #torn-dividend-manager .tsm-list {
                height: 600px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            #torn-dividend-manager .tsm-list::-webkit-scrollbar,
            #torn-dividend-manager .tsm-combination-list::-webkit-scrollbar {
                width: 2px;
            }

            #torn-dividend-manager .tsm-list::-webkit-scrollbar-track,
            #torn-dividend-manager .tsm-combination-list::-webkit-scrollbar-track {
                background: #242424;
            }

            #torn-dividend-manager .tsm-list::-webkit-scrollbar-thumb,
            #torn-dividend-manager .tsm-combination-list::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }

            #torn-dividend-manager .tsm-label {
                color: #888;
                font-size: 11px;
                margin-bottom: 3px;
            }

            #torn-dividend-manager .tsm-section-title {
                padding: 9px 12px;
                background: #303030;
                color: #aaa;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }

            @media screen and (max-width: 800px) {
                #torn-dividend-manager .tsm-layout {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                #torn-dividend-manager .tsm-stocks-panel,
                #torn-dividend-manager .tsm-right-panel {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                }

                #torn-dividend-manager .tsm-stocks-panel {
                    border-right: 0;
                    border-bottom: 1px solid #333;
                }

                #torn-dividend-manager .tsm-list,
                #torn-dividend-manager .tsm-combination-list {
                    height: auto;
                    max-height: none;
                    overflow: visible;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function renderStockDebug() {
        if (!manager) {
            return;
        }

        const list = manager.querySelector('.tsm-list');

        if (!list) {
            return;
        }

        const stockNames = [
            ...document.querySelectorAll(
                '[data-name="nameTab"]'
            )
        ];

        list.innerHTML = '';

        stockNames.forEach((element, index) => {
            const parent = element.closest('ul');

            const item = document.createElement('div');

            item.style.padding = '8px 12px';
            item.style.borderBottom = '1px solid #333';
            item.style.fontSize = '11px';

            item.innerHTML = `
            <strong>${index + 1}.</strong>
            ID: ${element.id || 'none'}
            |
            Acronym: ${element.dataset.acronym || 'none'}
            <br>
            Parent ID: ${parent?.id || 'none'}
            |
            Parent class: ${parent?.className || 'none'}
        `;

            list.appendChild(item);
        });
    }

    function waitForStocks() {
        const stockNames = document.querySelectorAll(
            '[data-name="nameTab"]'
        );

        const debug = document.querySelector('.tsm-debug');
        if (debug) {
            debug.innerHTML = `Found ${stockNames.length} stocks`;
        }

        if (!stockNames.length) {
            setTimeout(waitForStocks, 500);

            return;
        }

        if (!manager) {
            if (!createManager()) {
                setTimeout(waitForStocks, 500);

                return;
            }
        }

        // sortAndRender();
        renderStockDebug();

        setTimeout(waitForStocks, 1000);
    }

    waitForStocks();
})();