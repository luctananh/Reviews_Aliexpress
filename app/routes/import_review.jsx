import { json } from "@remix-run/node";
import { prisma } from "../server/db.server";
import axios from "axios";
import * as cheerio from "cheerio";

// List of realistic User-Agents for rotation
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Randomized delay helper (Jitter)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// GET Loader to return active counts and settings for the Progress Bar polling
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    if (!productId) {
      return json({ count: 0, maxReviewCount: 20 });
    }

    const count = await prisma.review.count({
      where: { productId }
    });

    const setting = await prisma.setting.findFirst();
    const maxReviewCount = setting ? setting.maxReviewCount : 20;

    return json({ count, maxReviewCount });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const link = formData.get("productURL");
    const productId = formData.get("productId");

    if (!link || !productId) {
      return json(
        { error: "Please enter a product link and product ID!" },
        { status: 400 }
      );
    }

    // Read maximum reviews settings
    const setting = await prisma.setting.findFirst();
    const maxReviewCount = setting ? setting.maxReviewCount : 20;

    // Parse AliExpress Product ID
    const parts = link.split("/");
    const lastSegment = parts.pop() || parts.pop();
    const aliProductId = lastSegment.split(".")[0];

    // Read Cloudflare Worker Proxy URL from Env or use a empty fallback for testing
    const proxyBaseUrl = process.env.CLOUDFLARE_WORKER_PROXY_URL || "";

    let allReviews = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && allReviews.length < parseInt(maxReviewCount)) {
      const feedbackUrl = `https://feedback.aliexpress.com/display/productEvaluation.htm?v=2&productId=${aliProductId}&ownerMemberId=2668009148&companyId=2668009148&memberType=seller&startValidDate=&i18n=true&page=${page}`;
      
      // Determine request URL (through proxy if configured, else direct)
      const requestUrl = proxyBaseUrl 
        ? `${proxyBaseUrl}?url=${encodeURIComponent(feedbackUrl)}`
        : feedbackUrl;

      // Make the request with randomized User-Agent
      const response = await axios.get(requestUrl, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          "Accept-Language": "en-US,en;q=0.9",
        }
      });

      const $ = cheerio.load(response.data);
      const reviews = $(".feedback-item")
        .map((index, element) => {
          let reviewName =
            $(element).find(".fb-user-info .user-name a").text() ||
            $(element).find(".fb-user-info .user-name").text();
          let reviewCountry = $(element)
            .find(".fb-user-info .user-country b")
            .text();
          let reviewContent = $(element)
            .find(".buyer-feedback span:nth-child(1)")
            .text();
          let reviewTime = $(element)
            .find(".buyer-feedback span:nth-child(2)")
            .text();
          let reviewRating = $(element).find(".star-view span").attr("style");
          let reviewImage =
            $(element).find(".feedback-photo img").attr("src") ||
            $(element).find("img").attr("src");
          
          let reviewRatingValue;
          switch (reviewRating) {
            case "width:100%":
              reviewRatingValue = "5";
              break;
            case "width:80%":
              reviewRatingValue = "4";
              break;
            case "width:60%":
              reviewRatingValue = "3";
              break;
            case "width:40%":
              reviewRatingValue = "2";
              break;
            case "width:20%":
              reviewRatingValue = "1";
              break;
            default:
              reviewRatingValue = "5";
          }
          return {
            name: reviewName,
            country: reviewCountry,
            rating: reviewRatingValue,
            time: reviewTime,
            feedback: reviewContent,
            image: reviewImage,
          };
        })
        .get();

      // If no reviews found on page, break early
      if (reviews.length === 0) {
        break;
      }

      // Save reviews to DB
      for (let review of reviews) {
        if (allReviews.length >= parseInt(maxReviewCount)) break;
        await prisma.review.create({
          data: {
            userName: review.name || "Anonymous",
            userAvatar: "",
            userContry: review.country || "",
            productImage: review.image || "",
            reviewContent: review.feedback || "",
            rating: review.rating,
            productId: productId,
          },
        });
        allReviews.push(review);
      }

      if (allReviews.length >= parseInt(maxReviewCount)) break;

      const nextPageButton = $(
        ".ui-pagination-next:not(.ui-pagination-disabled)"
      );
      hasNextPage = nextPageButton.length > 0;
      page++;

      // Optimized super-fast delay (50ms - 150ms) to avoid Vercel 10s timeout
      const randomDelay = Math.floor(Math.random() * 100) + 50;
      await sleep(randomDelay);
    }

    return json({ success: `Successfully fetched and saved ${allReviews.length} reviews!` });
  } catch (error) {
    console.error("Scraping error:", error.message);
    return json(
      { error: `Failed to fetch reviews: ${error.message}` },
      { status: 500 }
    );
  }
}
