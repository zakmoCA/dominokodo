import puppeteer from "puppeteer"

const getQuotes = async () => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("https://www.frugalfeeds.com.au/dominos", {
      waitUntil: "domcontentloaded",
    })

    await page.waitForSelector("table.tablepress", { timeout: 5000 })

    const deals = await page.evaluate(() => {
      const rows = document.querySelectorAll("tr.row-1, tr.row-2, tr.row-3, tr.row-4, tr.row-5, tr.row-6, tr.row-7, tr.row-8, tr.row-9, tr.row-10, tr.row-11, tr.row-12, tr.row-13, tr.row-14, tr.row-15")
      
      const allDeals = Array.from(rows).map(row => {
        const code = row.querySelector(".column-1")?.innerText?.trim() || ""
        const deal = row.querySelector(".column-2")?.innerText?.trim() || ""
        const expiry = row.querySelector(".column-3")?.innerText?.trim() || ""

        return {
          code,
          deal,
          expiry
        }
      })

      // 40% off premium/traditional pizzas is a frequent coupon
      const fortyPercentDeals = allDeals.filter(deal => 
        deal.deal.includes("40%")
      )

      return {
        allDeals,
        fortyPercentDeals
      }
    })

    console.log("All Deals:", deals.allDeals)
    console.log("\n40% Deals:", deals.fortyPercentDeals)

  } catch (error) {
    console.error("Error:", error)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

getQuotes()