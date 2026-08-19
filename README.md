# TORN Dividend Planner

A Tampermonkey userscript for [TORN](https://www.torn.com/) that makes planning stock dividends faster and easier.

Instead of manually checking which dividend stocks you can afford and calculating combinations yourself, TORN Dividend Planner turns your current stock portfolio value into an interactive dividend budget builder.

## Features

- Sorts TORN stocks by the cost required to unlock their dividend.
- Calculates your current portfolio value from your existing stock holdings.
- Shows the dividend benefit for each stock.
- Shows the number of shares required for each dividend.
- Highlights stocks based on your available budget:
  - **Green** — the dividend is currently affordable.
  - **Red** — the dividend is currently outside your available budget.
- Click an affordable stock to add it to your dividend combination.
- Selected stocks are removed from the available stock list.
- Selected dividends appear in the combination panel on the right.
- Click a selected dividend to remove it from the combination.
- Automatically recalculates the remaining budget after every selection.
- Displays the total cost of the current combination.
- Can be collapsed to keep the stocks page compact.
- Uses the dividend information already displayed by TORN where possible.

## How It Works

The planner uses the total current value of your existing stock holdings as your hypothetical budget.

For example:

```text
Current portfolio value
$500,000,000

Selected dividend
$58,699,500

Remaining budget
$441,300,500
```

After selecting a dividend, the planner recalculates which other dividends can still fit within the remaining budget.

Your actual TORN stock holdings are **not changed** by the userscript. The combination is only a planning tool.

## Usage

### 1. Open the TORN stock market

Go to:

**TORN → Stocks**

The Dividend Planner will appear above the normal stock list.

### 2. Check your budget

The planner displays your current portfolio value at the top.

This value is calculated from the stocks you currently own.

### 3. Choose dividends

The left panel contains the available dividends.

Green stocks can currently be afforded.

Click a green stock to add it to your combination.

### 4. Build your combination

Selected dividends appear in the **Your combination** panel.

The planner immediately updates the remaining budget and the available stocks.

### 5. Remove a dividend

Click a selected dividend in the right-hand panel to remove it.

It will return to the available stocks list and the budget will be recalculated.

## Important Notes

### TORN page changes

TORN's website uses dynamically generated CSS class names. The userscript currently relies on selectors from the current TORN stocks page.

If TORN changes the structure or class names of the stock market, the script may need to be updated.

### Dividend share requirements

The script contains the share requirements used to calculate the cost of each dividend. These values are maintained in the `BENEFIT_SHARES` object.

If TORN changes a dividend's requirements, the corresponding value in the script will need to be updated.

### No purchases are made

This userscript does not automatically buy or sell stocks.

It only reads information from the TORN stock market and provides a visual planning interface.

## License

This project is provided as-is for personal use.

TORN and its associated trademarks belong to their respective owners.
