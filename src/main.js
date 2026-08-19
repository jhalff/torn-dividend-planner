import { DIVIDEND_DATA, STOCK_ACRONYMS } from './data.js';
import styles from './styles.css?raw';

(function () {
    'use strict';

    const STOCK_SELECTOR = '[data-name="nameTab"]';
    const CONTAINER_SELECTOR = '[class*="stockMarket___"], [data-testid*="stock-market" i]';
    const IS_MOBILE = window.matchMedia('(max-width: 800px)').matches;

    if (new URL(window.location.href).searchParams.get('sid') !== 'stocks') {
        return;
    }

    let manager = null;
    let selectedStocks = [];

    function parseNumber(value) {
        if (!value) {
            return 0;
        }

        return parseFloat(value.replace(/[$,]/g, '').trim()) || 0;
    }

    function getStockData(stock) {
        const nameElement = stock.querySelector('[data-name="nameTab"]');
        const priceTab = stock.querySelector('[data-name="priceTab"]');
        const ownedTab = stock.querySelector('[data-name="ownedTab"]');

        if (!nameElement || !priceTab || !ownedTab) {
            return null;
        }

        const rawName = nameElement.textContent
            .trim()
            .replace(/^\([A-Z]+\)\s*/, '')
            .trim();

        const acronym = nameElement.dataset.acronym || nameElement.querySelector('[data-acronym]')?.dataset.acronym || STOCK_ACRONYMS[rawName];
        if (!acronym) {
            return null;
        }

        const name = rawName;
        const priceMatch = priceTab.textContent.match(/\d+(?:\.\d+)/);
        const price = parseNumber(priceMatch?.[0]);
        const ownedLabel = ownedTab.getAttribute('aria-label') || '';
        const sharesMatch = ownedLabel.match(/Owned:\s*([\d,]+)\s*shares/i);
        const ownedShares = parseNumber(sharesMatch?.[1]);
        const ownedValue = price * ownedShares;

        const dividend = DIVIDEND_DATA[acronym];

        if (!dividend) {
            return null;
        }

        const benefit = dividend.benefit;
        const benefitShares = dividend.shares;
        const payoutCycle = dividend.payoutCycle;
        const incrementShares = dividend.incrementShares;

        const dividendCost = price * benefitShares;
        const incrementCost = incrementShares ? price * incrementShares : null;

        return {
            element: stock,
            acronym,
            name,
            price,
            ownedValue,
            ownedShares,
            benefit,
            benefitShares,
            dividendCost,
            payoutCycle,
            incrementShares,
            incrementCost
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
        newManager.classList.add('is-collapsed');

        newManager.innerHTML = `
            <div class="tsm-header">
                <div class="tsm-header-title">
                    <strong>Dividend Planner</strong>
                    <span class="tsm-header-count"></span>
                </div>

                <button
                    type="button"
                    class="tsm-toggle"
                    aria-label="Collapse stock manager"
                    aria-expanded="true"
                >
                    ▼
                </button>
            </div>

            <div class="tsm-content">
                <div class="tsm-portfolio">
                    <div class="tsm-portfolio-value">
                        Total:
                        <strong>$0</strong>
                    </div>

                    <div class="tsm-portfolio-remaining">
                        Available:
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

        const stockMarket = document.querySelector(CONTAINER_SELECTOR) || document.querySelector(STOCK_SELECTOR)?.parentElement;
        if (!stockMarket?.parentElement) {
            return false;
        }

        manager = newManager;

        stockMarket.parentElement.insertBefore(manager, stockMarket);
        addStyles();

        const toggle = manager.querySelector('.tsm-toggle');

        toggle.addEventListener('click', () => {
            const collapsed = manager.classList.toggle('is-collapsed');

            toggle.textContent = collapsed ? '▼' : '▲';
            toggle.setAttribute('aria-expanded', String(!collapsed));
            toggle.setAttribute('aria-label', collapsed ? 'Expand stock manager' : 'Collapse stock manager');
        });

        return true;
    }

    function renderPortfolio(portfolioValue) {
        const valueElement = manager.querySelector('.tsm-portfolio-value strong');
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

                        <span class="tsm-selected-cycle">
                            Every ${stock.payoutCycle} days
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

            if (IS_MOBILE) {
                item.title = 'Click to remove from combination';
            }

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

                const affordable = canAfford(
                    stock,
                    remainingBudget
                );

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

                const cycle = stock.payoutCycle
                    ? `Every ${stock.payoutCycle} days`
                    : '';

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

                    <span class="tsm-cycle">
                        ${cycle}
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
                    if (IS_MOBILE) {
                        item.title = 'Click to add to combination';
                    }

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

        style.textContent = styles;

        document.head.appendChild(style);
    }

    function waitForStocks() {
        const stockNames = document.querySelectorAll(
            '[data-name="nameTab"]'
        );

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

        sortAndRender();

        setTimeout(waitForStocks, 1000);
    }

    waitForStocks();
})();