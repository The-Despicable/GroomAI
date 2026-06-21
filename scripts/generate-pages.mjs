import { stitch } from "@google/stitch-sdk";
import { writeFileSync } from "fs";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

const PROJECT_ID = "18294432027744375469";
const project = stitch.project(PROJECT_ID);

const PAGES = [
  {
    name: "admin-dashboard",
    prompt: `GroomAI admin panel for managing salon booking platform. Dark theme with gold (#C9A84C) accents. Left sidebar with navigation: Dashboard, Salons, Users, Bookings, Reviews, Settings. Main area shows stats cards (Total Salons: 24, Active Users: 1,247, Bookings Today: 38, Revenue: ₹48,250). Below stats, a table of recent bookings with columns: Customer, Salon, Service, Date, Status, Actions. Status badges: Confirmed (green), Pending (yellow), Cancelled (red). Top bar with admin avatar and search. Gold gradient header.`,
    file: "admin/page.tsx"
  },
  {
    name: "about",
    prompt: `GroomAI About page. Dark theme with gold (#C9A84C) accents. Hero section with gradient gold text "About GroomAI" and subtitle "Hyderabad's premier AI-powered salon booking platform". Mission section explaining how GroomAI connects users with top barbers and stylists in Banjara Hills and Jubilee Hills. Features grid: AI-Powered Matching (24/7 assistant helps find perfect salon), Curated Selection (handpicked premium salons), Easy Booking (book in 30 seconds), Verified Reviews (real customer feedback). Team section with 3 stylist/barber profile cards. Contact section with email, phone, location.`,
    file: "about/page.tsx"
  },
  {
    name: "faq",
    prompt: `GroomAI FAQ/Help page. Dark theme with gold (#C9A84C) accents. Search bar at top "Search help articles...". Accordion-style FAQ categories: Booking (How do I book? Can I cancel? How to reschedule?), Payment (What methods accepted? Is it secure? Refund policy?), Account (How to sign up? Reset password?), Salons (How are salons curated? Can I review?). Each question is an expandable card with gold left border. Background has subtle gold gradient glow effects. Back to Home button at bottom.`,
    file: "help/page.tsx"
  },
  {
    name: "checkout-improved",
    prompt: `GroomAI booking checkout page. Dark theme with gold (#C9A84C) accents. Two-column layout. Left column: Booking summary showing salon name, service name with price and duration, date picker (calendar view), time slot selection (grid of available times 9:00-20:00), stylist selection (horizontal card list of 4 stylists with avatar, name, rating, "Available" badge). Right column: Price breakdown (service price, tax 18%, total), payment method selection (razorpay, credit card, upi options), large gold "Confirm Booking" button. Background has subtle gold gradient glow effects.`,
    file: "checkout-improved/page.tsx"
  },
  {
    name: "bookings-improved",
    prompt: `GroomAI bookings list page. Dark theme with gold (#C9A84C) accents. Top section: "My Bookings" heading with filters row - date range picker, status filter (All, Confirmed, Pending, Cancelled), search bar "Search bookings...". Booking cards in vertical list. Each card shows: salon image thumbnail, salon name, service name, date and time, status badge (Confirmed=green, Pending=yellow, Cancelled=red), price, action buttons (Reschedule, Cancel, Write Review). Empty state: illustration and "No bookings yet. Find a salon!" with CTA button. Background has subtle gold gradient effects.`,
    file: "bookings/page.tsx"
  },
  {
    name: "profile-improved",
    prompt: `GroomAI user profile page. Dark theme with gold (#C9A84C) accents. Top section: user avatar (large circle), name "Rahul Sharma", email, phone, member since date. Stats row: 12 Total Visits, 4 Loyalty Points, 3 Reviews Written. Tabs: Appointment History, Favorite Salons, Settings. Appointment History tab shows list of past bookings with salon name, date, service, rebook button. Favorite Salons tab shows saved salon cards. Settings tab has fields: Name, Email, Phone, Notification Toggle, Dark Mode Toggle. Gold gradient accent lines.`,
    file: "profile/page.tsx"
  },
  {
    name: "dashboard-improved",
    prompt: `GroomAI salon owner dashboard. Dark theme with gold (#C9A84C) accents. Top stats row: Today's Appointments (12), Revenue Today (₹8,450), Total Customers (156), Rating (4.8). 3 tabs: Appointments, Customers, Analytics. Appointments tab: vertical timeline showing today's bookings with customer name, service, time, status (Checked In, Confirmed, Completed), action buttons (Check In, Complete). Customer tab: searchable table with name, phone, total visits, last visit, total spent, actions. Analytics tab: revenue chart (bar graph), popular services pie chart, peak hours chart. Gold accent gradients.`,
    file: "dashboard/page.tsx"
  },
  {
    name: "assistant-improved",
    prompt: `GroomAI AI chat assistant page. Dark theme with gold (#C9A84C) accents. Full-height chat interface. Left: conversation history sidebar showing chat sessions with date previews. Main: chat header "GroomAI Assistant" with gold dot indicator "Online". Message bubbles: user messages right-aligned (dark gray), AI messages left-aligned with gold left border. Salon recommendation cards within chat showing salon name, rating, price, image thumbnail, "View Salon" button. Input bar at bottom with text field, attachment icon, send button (gold gradient). Empty state: "Ask me anything about salons in Hyderabad!" with suggestion chips: "Find a barber", "Book a haircut", "Best salons near me".`,
    file: "assistant/page.tsx"
  },
  {
    name: "terms-privacy",
    prompt: `GroomAI Terms of Service and Privacy Policy page. Dark theme with gold (#C9A84C) accents. Top: gradient gold heading "Terms of Service" with last updated date. Two tabs at top: Terms of Service, Privacy Policy. Content sections with gold left border accent. Each section has a heading in gold and body text in light gray. Terms sections: Acceptance, Account Responsibilities, Booking & Cancellation, Payments, Salon Listings, Limitation of Liability. Privacy sections: Information Collection, How We Use Data, Data Sharing, Security, Cookies, Contact. Links to email privacy@groomai.app for questions. Back to Home link.`,
    file: "terms/page.tsx"
  }
];

console.log(`Starting generation of ${PAGES.length} pages...\n`);

for (const page of PAGES) {
  console.log(`Generating: ${page.name}...`);
  try {
    const screen = await project.generate(page.prompt, "DESKTOP");
    const htmlUrl = await screen.getHtml();
    const imgUrl = await screen.getImage();
    console.log(`  ✅ Generated | HTML: ${htmlUrl}\n  🖼️  Screenshot: ${imgUrl}\n`);
  } catch (e) {
    console.log(`  ❌ Failed: ${e.message || e}\n`);
  }
}

console.log("Done! All pages generated.");
