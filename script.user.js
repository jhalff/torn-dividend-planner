// ==UserScript==
// @name         TORN Dividend Planner
// @namespace    https://github.com/jhalff/torn-dividend-planner
// @version      1.2.2
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

(function(){var e={THS:{benefit:`1x Box of Medical Supplies`,shares:15e4,payoutCycle:7,incrementShares:3e5},WSU:{benefit:`10% education course time reduction`,shares:1e6,payoutCycle:7,incrementShares:null},TCT:{benefit:`$1,000,000`,shares:1e5,payoutCycle:31,incrementShares:2e5},IST:{benefit:`Free education courses`,shares:1e5,payoutCycle:7,incrementShares:null},TCI:{benefit:`10% bank interest bonus`,shares:15e5,payoutCycle:7,incrementShares:15e5},FHG:{benefit:`1x Feathery Hotel Coupon`,shares:2e6,payoutCycle:7,incrementShares:2e6},MCS:{benefit:`100 energy`,shares:35e4,payoutCycle:7,incrementShares:35e4},WLT:{benefit:`Private jet access`,shares:9e6,payoutCycle:7,incrementShares:9e6},SYM:{benefit:`1x Drug Pack`,shares:5e5,payoutCycle:7,incrementShares:5e5},EVL:{benefit:`1000 happiness`,shares:1e5,payoutCycle:7,incrementShares:1e5},SYS:{benefit:`An Advanced firewall`,shares:3e6,payoutCycle:7,incrementShares:3e6},PRN:{benefit:`1x Erotic DVD`,shares:1e6,payoutCycle:7,incrementShares:1e6},LSC:{benefit:`1x Lottery Voucher`,shares:5e5,payoutCycle:7,incrementShares:5e5},MUN:{benefit:`1x Six-Pack of Energy Drink`,shares:5e6,payoutCycle:7,incrementShares:5e6},TCP:{benefit:`A Company sales boost`,shares:1e6,payoutCycle:7,incrementShares:1e6},BAG:{benefit:`1x Ammunition Pack`,shares:3e6,payoutCycle:7,incrementShares:3e6},LAG:{benefit:`1x Lawyer's Business Card`,shares:75e4,payoutCycle:7,incrementShares:75e4},CBD:{benefit:`50 nerve`,shares:35e4,payoutCycle:7,incrementShares:345e3},ASS:{benefit:`1x Six-Pack of Alcohol`,shares:1e6,payoutCycle:7,incrementShares:1e6},ELT:{benefit:`10% home upgrade discount`,shares:5e6,payoutCycle:7,incrementShares:5e6},TCM:{benefit:`10% racing skill gain boost`,shares:1e6,payoutCycle:7,incrementShares:1e6},MSG:{benefit:`Free classified advertising`,shares:3e5,payoutCycle:7,incrementShares:3e5},EWM:{benefit:`1x Box of Grenades`,shares:1e6,payoutCycle:7,incrementShares:1e6},TGP:{benefit:`A Company advertising boost`,shares:25e5,payoutCycle:7,incrementShares:25e5},IIL:{benefit:`50% coding time reduction`,shares:1e6,payoutCycle:7,incrementShares:1e6},LOS:{benefit:`25% boost to mission credits and money earned`,shares:75e5,payoutCycle:7,incrementShares:75e5},PTS:{benefit:`100 points`,shares:1e7,payoutCycle:7,incrementShares:1e7},YAZ:{benefit:`Free banner advertising`,shares:1e6,payoutCycle:7,incrementShares:1e6},TSB:{benefit:`$50,000,000`,shares:3e6,payoutCycle:31,incrementShares:3e6},CNC:{benefit:`$80,000,000`,shares:75e5,payoutCycle:31,incrementShares:75e5},TCC:{benefit:`1x Clothing Cache`,shares:75e5,payoutCycle:31,incrementShares:75e5},GRN:{benefit:`$4,000,000`,shares:5e5,payoutCycle:31,incrementShares:5e5},HRG:{benefit:`1x Random Property`,shares:1e7,payoutCycle:31,incrementShares:1e7},TMI:{benefit:`$25,000,000`,shares:6e6,payoutCycle:31,incrementShares:6e6},IOU:{benefit:`$12,000,000`,shares:3e6,payoutCycle:31,incrementShares:3e6}},t={"Torn City Health Service":`THS`,"West Side University":`WSU`,"The Torn City Times":`TCT`,"International School TC":`IST`,"Torn City Investments":`TCI`,"Feathery Hotels Group":`FHG`,"Mc Smoogle Corp":`MCS`,"Wind Lines Travel":`WLT`,"Symbiotic Ltd.":`SYM`,"Evil Ducks Candy Corp":`EVL`,"Syscore MFG":`SYS`,"Performance Ribaldry":`PRN`,"Lucky Shot Casino":`LSC`,"Munster Beverage Corp.":`MUN`,"TC Media Productions":`TCP`,"Big Al's Gun Shop":`BAG`,"Legal Authorities Group":`LAG`,"Herbal Releaf Co.":`CBD`,"Alcoholics Synonymous":`ASS`,"Empty Lunchbox Traders":`ELT`,"Torn City Motors":`TCM`,"Messaging Inc.":`MSG`,"Eaglewood Mercenary":`EWM`,"Tell Group Plc.":`TGP`,"I Industries Ltd.":`IIL`,"Lo Squalo Waste":`LOS`,PointLess:`PTS`,Yazoo:`YAZ`,"Torn & Shanghai Banking":`TSB`,"Crude & Co":`CNC`,"Torn City Clothing":`TCC`,Grain:`GRN`,"Home Retail Group":`HRG`,"TC Music Industries":`TMI`,"Insured On Us":`IOU`},n=`#torn-dividend-manager {\r
    margin-bottom: 10px;\r
    background: #242424;\r
    border-radius: 4px;\r
    overflow: hidden;\r
}\r
\r
#torn-dividend-manager .tsm-header {\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
    padding: 10px 12px;\r
    background: #303030;\r
    color: #ddd;\r
    font-size: 14px;\r
}\r
\r
#torn-dividend-manager .tsm-header-title {\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
    min-width: 0;\r
}\r
\r
#torn-dividend-manager .tsm-header-count {\r
    color: #888;\r
    font-size: 12px;\r
}\r
\r
#torn-dividend-manager .tsm-toggle {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    width: 24px;\r
    height: 24px;\r
    padding: 0;\r
    border: 0;\r
    border-radius: 3px;\r
    background: #3a3a3a;\r
    color: #aaa;\r
    font-size: 10px;\r
    cursor: pointer;\r
}\r
\r
#torn-dividend-manager .tsm-toggle:hover {\r
    background: #525252;\r
    color: #fff;\r
}\r
\r
#torn-dividend-manager .tsm-content {\r
    display: block;\r
}\r
\r
#torn-dividend-manager.is-collapsed .tsm-content {\r
    display: none;\r
}\r
\r
#torn-dividend-manager .tsm-layout {\r
    display: grid;\r
    grid-template-columns: repeat(2, minmax(0, 1fr));\r
    align-items: start;\r
}\r
\r
#torn-dividend-manager .tsm-stocks-panel {\r
    min-width: 0;\r
    border-right: 1px solid #333;\r
}\r
\r
#torn-dividend-manager .tsm-right-panel {\r
    min-width: 0;\r
}\r
\r
#torn-dividend-manager .tsm-portfolio {\r
    background: #292929;\r
    border-bottom: 1px solid #333;\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
    padding: 9px 12px;\r
}\r
\r
#torn-dividend-manager .tsm-portfolio-value {\r
    color: #777;\r
    font-size: 11px;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
#torn-dividend-manager .tsm-portfolio-value strong {\r
    color: #aaa;\r
}\r
\r
#torn-dividend-manager .tsm-portfolio-remaining {\r
    margin-left: auto;\r
    color: #777;\r
    font-size: 11px;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
#torn-dividend-manager .tsm-portfolio-remaining strong {\r
    color: #aaa;\r
}\r
\r
#torn-dividend-manager .tsm-budget-negative {\r
    background: #3a2424;\r
}\r
\r
#torn-dividend-manager .tsm-combination {\r
    padding: 9px 12px;\r
    border-bottom: 1px solid #333;\r
}\r
\r
#torn-dividend-manager .tsm-combination-list {\r
    height: 600px;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
}\r
\r
#torn-dividend-manager .tsm-empty {\r
    padding: 12px;\r
    color: #777;\r
    font-size: 12px;\r
    line-height: 1.5;\r
}\r
\r
#torn-dividend-manager .tsm-selected-stock {\r
    display: grid;\r
    grid-template-columns: 40px 1fr 110px;\r
    align-items: center;\r
    gap: 8px;\r
    width: 100%;\r
    padding: 7px 12px;\r
    border: 0;\r
    border-bottom: 1px solid #333;\r
    background: transparent;\r
    color: #ccc;\r
    text-align: left;\r
    cursor: pointer;\r
}\r
\r
#torn-dividend-manager .tsm-selected-stock:hover {\r
    background: #333;\r
}\r
\r
#torn-dividend-manager .tsm-selected-main {\r
    display: contents;\r
}\r
\r
#torn-dividend-manager .tsm-selected-acronym {\r
    color: #8fc98f;\r
    font-weight: bold;\r
}\r
\r
#torn-dividend-manager .tsm-selected-info {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 2px;\r
    min-width: 0;\r
}\r
\r
#torn-dividend-manager .tsm-selected-company {\r
    color: #ccc;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-selected-benefit {\r
    color: #8f8f8f;\r
    font-size: 11px;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-selected-details {\r
    display: flex;\r
    flex-direction: column;\r
    align-items: flex-end;\r
    gap: 2px;\r
}\r
\r
#torn-dividend-manager .tsm-selected-shares {\r
    color: #777;\r
    font-size: 10px;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-selected-cost {\r
    color: #fff;\r
    font-size: 12px;\r
    font-variant-numeric: tabular-nums;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-combination-summary {\r
    padding: 10px 12px;\r
    border-top: 1px solid #333;\r
    background: #292929;\r
    color: #777;\r
    font-size: 11px;\r
}\r
\r
#torn-dividend-manager .tsm-combination-summary>div {\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
    gap: 10px;\r
}\r
\r
#torn-dividend-manager .tsm-combination-summary strong {\r
    color: #fff;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
#torn-dividend-manager .tsm-combination-remaining {\r
    margin-top: 4px;\r
}\r
\r
#torn-dividend-manager .tsm-stocks-panel,\r
#torn-dividend-manager .tsm-right-panel {\r
    min-width: 0;\r
    max-width: 100%;\r
}\r
\r
#torn-dividend-manager .tsm-stock {\r
    display: grid;\r
    grid-template-columns: 40px 1fr 110px;\r
    align-items: center;\r
    gap: 8px;\r
    width: 100%;\r
    padding: 7px 12px;\r
    border: 0;\r
    border-bottom: 1px solid #333;\r
    background: transparent;\r
    color: #ccc;\r
    text-align: left;\r
    cursor: pointer;\r
    transition: background 0.1s ease;\r
}\r
\r
#torn-dividend-manager .tsm-stock:hover {\r
    background: #333;\r
}\r
\r
#torn-dividend-manager .tsm-stock:disabled {\r
    cursor: not-allowed;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-affordable {\r
    background: rgba(70, 130, 70, 0.08);\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-affordable:hover {\r
    background: rgba(70, 130, 70, 0.20);\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-unaffordable {\r
    background: rgba(130, 55, 55, 0.08);\r
    opacity: 0.65;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-selected {\r
    background: rgba(70, 110, 70, 0.22);\r
    box-shadow: inset 3px 0 0 #6fa66f;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-selected:hover {\r
    background: rgba(70, 110, 70, 0.30);\r
}\r
\r
#torn-dividend-manager .tsm-acronym {\r
    color: #aaa;\r
    font-weight: bold;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-affordable .tsm-acronym {\r
    color: #8fc98f;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-unaffordable .tsm-acronym {\r
    color: #c47b7b;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-selected .tsm-acronym {\r
    color: #8fc98f;\r
}\r
\r
#torn-dividend-manager .tsm-name {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 2px;\r
    min-width: 0;\r
}\r
\r
#torn-dividend-manager .tsm-company {\r
    color: #ccc;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-benefit {\r
    color: #8f8f8f;\r
    font-size: 11px;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-cycle {\r
    color: #777;\r
    font-size: 10px;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-details {\r
    display: flex;\r
    flex-direction: column;\r
    align-items: flex-end;\r
    gap: 2px;\r
}\r
\r
#torn-dividend-manager .tsm-shares {\r
    color: #777;\r
    font-size: 10px;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-price {\r
    color: #fff;\r
    font-size: 12px;\r
    font-variant-numeric: tabular-nums;\r
    white-space: nowrap;\r
}\r
\r
#torn-dividend-manager .tsm-stock.tsm-unaffordable .tsm-price {\r
    color: #b87878;\r
}\r
\r
#torn-dividend-manager .tsm-selected-cycle {\r
    color: #777;\r
    font-size: 10px;\r
}\r
\r
#torn-dividend-manager .tsm-list {\r
    height: 600px;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
}\r
\r
#torn-dividend-manager .tsm-list::-webkit-scrollbar,\r
#torn-dividend-manager .tsm-combination-list::-webkit-scrollbar {\r
    width: 2px;\r
}\r
\r
#torn-dividend-manager .tsm-list::-webkit-scrollbar-track,\r
#torn-dividend-manager .tsm-combination-list::-webkit-scrollbar-track {\r
    background: #242424;\r
}\r
\r
#torn-dividend-manager .tsm-list::-webkit-scrollbar-thumb,\r
#torn-dividend-manager .tsm-combination-list::-webkit-scrollbar-thumb {\r
    background: #444;\r
    border-radius: 3px;\r
}\r
\r
#torn-dividend-manager .tsm-label {\r
    color: #888;\r
    font-size: 11px;\r
    margin-bottom: 3px;\r
}\r
\r
#torn-dividend-manager .tsm-section-title {\r
    padding: 9px 12px;\r
    background: #303030;\r
    color: #aaa;\r
    font-size: 12px;\r
    font-weight: bold;\r
    text-transform: uppercase;\r
}\r
\r
@media screen and (max-width: 800px) {\r
    #torn-dividend-manager .tsm-tooltip {\r
        display: none;\r
    }\r
\r
    #torn-dividend-manager .tsm-layout {\r
        display: flex;\r
        flex-direction: column;\r
        width: 100%;\r
    }\r
\r
    #torn-dividend-manager .tsm-stocks-panel,\r
    #torn-dividend-manager .tsm-right-panel {\r
        width: 100%;\r
        max-width: 100%;\r
        min-width: 0;\r
    }\r
\r
    #torn-dividend-manager .tsm-stocks-panel {\r
        border-right: 0;\r
        border-bottom: 1px solid #333;\r
    }\r
\r
    #torn-dividend-manager .tsm-list,\r
    #torn-dividend-manager .tsm-combination-list {\r
        height: auto;\r
        max-height: none;\r
        overflow: visible;\r
    }\r
}`;(function(){"use strict";let r=`[data-name="nameTab"]`,i=window.matchMedia(`(max-width: 800px)`).matches;if(new URL(window.location.href).searchParams.get(`sid`)!==`stocks`)return;let a=null,o=[];function s(e){return e&&parseFloat(e.replace(/[$,]/g,``).trim())||0}function c(n){let r=n.querySelector(`[data-name="nameTab"]`),i=n.querySelector(`[data-name="priceTab"]`),a=n.querySelector(`[data-name="ownedTab"]`);if(!r||!i||!a)return null;let o=r.textContent.trim().replace(/^\([A-Z]+\)\s*/,``).trim(),c=r.dataset.acronym||r.querySelector(`[data-acronym]`)?.dataset.acronym||t[o];if(!c)return null;let l=o,u=s(i.textContent.match(/\d+(?:\.\d+)/)?.[0]),d=s((a.getAttribute(`aria-label`)||``).match(/Owned:\s*([\d,]+)\s*shares/i)?.[1]),f=u*d,p=e[c];if(!p)return null;let m=p.benefit,h=p.shares,g=p.payoutCycle,_=p.incrementShares;return{element:n,acronym:c,name:l,price:u,ownedValue:f,ownedShares:d,benefit:m,benefitShares:h,dividendCost:u*h,payoutCycle:g,incrementShares:_,incrementCost:_?u*_:null}}function l(){let e=[];return document.querySelectorAll(r).forEach(t=>{let n=t.closest(`ul`);n&&(e.includes(n)||e.push(n))}),e.map(c).filter(Boolean)}function u(e){return e.reduce((e,t)=>e+t.ownedValue,0)}function d(){return o.reduce((e,t)=>e+t.dividendCost,0)}function f(e){return e-d()}function p(e){return o.some(t=>t.acronym===e.acronym)}function m(e,t){return e.dividendCost!==null&&e.dividendCost>0&&e.dividendCost<=t}function h(e){p(e)||m(e,f(u(l())))&&(o.push(e),x())}function g(e){o=o.filter(t=>t.acronym!==e.acronym),x()}function _(){let e=document.createElement(`div`);e.id=`torn-dividend-manager`,e.classList.add(`is-collapsed`),e.innerHTML=`
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
        `;let t=document.querySelector(`[class*="stockMarket___"], [data-testid*="stock-market" i]`)||document.querySelector(r)?.parentElement;if(!t?.parentElement)return!1;a=e,t.parentElement.insertBefore(a,t),S();let n=a.querySelector(`.tsm-toggle`);return n.addEventListener(`click`,()=>{let e=a.classList.toggle(`is-collapsed`);n.textContent=e?`▼`:`▲`,n.setAttribute(`aria-expanded`,String(!e)),n.setAttribute(`aria-label`,e?`Expand stock manager`:`Collapse stock manager`)}),!0}function v(e){let t=a.querySelector(`.tsm-portfolio-value strong`),n=a.querySelector(`.tsm-portfolio-remaining strong`),r=e-d();t.textContent=`$${Math.round(e).toLocaleString()}`,n.textContent=`$${Math.round(r).toLocaleString()}`,a.querySelector(`.tsm-portfolio`).classList.toggle(`tsm-budget-negative`,r<0)}function y(){let e=a.querySelector(`.tsm-combination-list`);if(e.innerHTML=``,!o.length){e.innerHTML=`
                <div class="tsm-empty">
                    Select an affordable stock to build your combination.
                </div>
            `;return}let t=d();o.forEach(t=>{let n=document.createElement(`button`);n.type=`button`,n.className=`tsm-selected-stock`,n.innerHTML=`
                <span class="tsm-selected-main">
                    <span class="tsm-selected-acronym">
                        ${t.acronym}
                    </span>

                    <span class="tsm-selected-info">
                        <span class="tsm-selected-company">
                            ${t.name}
                        </span>

                        <span class="tsm-selected-benefit">
                            ${t.benefit}
                        </span>

                        <span class="tsm-selected-cycle">
                            Every ${t.payoutCycle} days
                        </span>
                    </span>
                </span>

                <span class="tsm-selected-details">
                    <span class="tsm-selected-shares">
                        ${t.benefitShares.toLocaleString()} shares
                    </span>

                    <span class="tsm-selected-cost">
                        $${Math.round(t.dividendCost).toLocaleString()}
                    </span>
                </span>
            `,i&&(n.title=`Click to remove from combination`),n.addEventListener(`click`,()=>{g(t)}),e.appendChild(n)});let n=a.querySelector(`.tsm-combination-remaining`);n&&n.remove();let r=u(l())-t,s=document.createElement(`div`);s.className=`tsm-combination-summary`,s.innerHTML=`
            <div>
                <span>Combination cost</span>
                <strong>
                    $${Math.round(t).toLocaleString()}
                </strong>
            </div>

            <div class="tsm-combination-remaining">
                <span>Remaining</span>
                <strong>
                    $${Math.round(r).toLocaleString()}
                </strong>
            </div>
        `,e.appendChild(s)}function b(e,t){let n=a.querySelector(`.tsm-list`);n.innerHTML=``;let r=a.querySelector(`.tsm-header-count`);r.textContent=`${e.length} stocks`;let o=f(t);e.filter(e=>!p(e)).forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`tsm-stock`;let r=m(e,o);r?t.classList.add(`tsm-affordable`):t.classList.add(`tsm-unaffordable`);let a=e.dividendCost===null?`N/A`:`$${Math.round(e.dividendCost).toLocaleString()}`,s=e.benefitShares===null?`No benefit data`:`${e.benefitShares.toLocaleString()} shares`,c=e.payoutCycle?`Every ${e.payoutCycle} days`:``;t.innerHTML=`
                <span class="tsm-acronym">
                    ${e.acronym}
                </span>

                <span class="tsm-name">
                    <span class="tsm-company">
                        ${e.name}
                    </span>

                    <span class="tsm-benefit">
                        ${e.benefit}
                    </span>

                    <span class="tsm-cycle">
                        ${c}
                    </span>
                </span>

                <span class="tsm-details">
                    <span class="tsm-shares">
                        ${s}
                    </span>

                    <span class="tsm-price">
                        ${a}
                    </span>
                </span>
            `,r?(i&&(t.title=`Click to add to combination`),t.addEventListener(`click`,()=>{h(e)})):(t.title=`Not enough funds`,t.disabled=!0),n.appendChild(t)})}function x(){let e=l();if(!e.length||!a)return;e.sort((e,t)=>e.dividendCost===null?1:t.dividendCost===null?-1:e.dividendCost-t.dividendCost);let t=u(e);v(t),y(),b(e,t)}function S(){let e=document.createElement(`style`);e.textContent=n,document.head.appendChild(e)}function C(){if(!document.querySelectorAll(`[data-name="nameTab"]`).length){setTimeout(C,500);return}if(!a&&!_()){setTimeout(C,500);return}x(),setTimeout(C,1e3)}C()})()})();