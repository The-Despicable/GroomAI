import { stitch } from "@google/stitch-sdk";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

const PROJECT_ID = "18294432027744375469";
const project = stitch.project(PROJECT_ID);

const PAGES = [
  {
    name: "checkout-improved",
    prompt: `GroomAI salon booking checkout page. Dark theme, gold (#C9A84C) accents. Two-column. Left: Booking summary (salon name, service name+price+duration), calendar date picker, time slot grid (9:00-20:00), stylist selection with 4 stylist cards (avatar, name, rating, Available badge). Right: Price breakdown (service, tax 18%, total), payment method buttons (Razorpay, Card, UPI), gold "Confirm Booking" button. Gold gradient glow effects.`
  },
  {
    name: "bookings-improved",
    prompt: `GroomAI bookings list page. Dark theme, gold (#C9A84C) accents. Top: "My Bookings" heading with filters - date range, status (All/Confirmed/Pending/Cancelled), search bar. Booking cards: salon thumbnail, name, service, date/time, status badge (green/yellow/red), price, action buttons (Reschedule/Cancel/Review). Empty state with "No bookings yet" message. Gold gradient effects.`
  },
  {
    name: "profile-improved",
    prompt: `GroomAI user profile page. Dark theme, gold (#C9A84C) accents. Large circular avatar, name, email, member date. Stats: 12 Total Visits, 4 Loyalty Points, 3 Reviews. Tabs: Appointment History, Favorite Salons, Settings. History tab: past booking list with rebook. Favorites: saved salon cards. Settings: Name, Email, Phone, Notification toggle, Dark mode toggle. Gold accent lines.`
  },
  {
    name: "dashboard-improved",
    prompt: `GroomAI salon owner dashboard. Dark theme, gold (#C9A84C) accents. Stats row: Today's Appointments (12), Revenue Today (₹8,450), Total Customers (156), Rating (4.8). 3 tabs: Appointments, Customers, Analytics. Appointments: timeline of today's bookings (customer, service, time, status, actions). Customers: searchable table (name, phone, visits, last visit, total spent). Analytics: revenue bar chart, popular services pie chart. Gold gradients.`
  },
  {
    name: "assistant-improved",
    prompt: `GroomAI AI chat assistant. Dark theme, gold (#C9A84C) accents. Full-height chat. Left: conversation history sidebar with date previews. Main: "GroomAI Assistant" header with green Online dot. User messages right-aligned (dark gray). AI messages left-aligned with gold left border. Salon cards in chat (name, rating, price, thumbnail, "View" button). Input bar with text field, send button (gold). Suggestion chips: "Find a barber", "Book a haircut", "Best salons near me".`
  },
  {
    name: "terms-privacy",
    prompt: `GroomAI Terms of Service & Privacy Policy. Dark theme, gold (#C9A84C) accents. Gold gradient heading "Terms of Service" with last updated date. Two tabs: Terms, Privacy. Content sections with gold left border. Headings in gold, body in light gray. Terms: Acceptance, Accounts, Booking & Cancellation, Payments, Salon Listings, Liability. Privacy: Information Collection, Data Use, Sharing, Security, Cookies, Contact. Email link privacy@groomai.app. Back to Home.`
  }
];

console.log("Generating remaining 6 pages...\n");

for (const page of PAGES) {
  console.log(`Generating: ${page.name}...`);
  try {
    const screen = await project.generate(page.prompt, "DESKTOP");
    const htmlUrl = await screen.getHtml();
    const imgUrl = await screen.getImage();
    console.log(`  ✅ Generated | HTML: ${htmlUrl}`);
    console.log(`  🖼️  Screenshot: ${imgUrl}\n`);
  } catch (e) {
    console.log(`  ❌ Failed: ${e.message || e}\n`);
  }
}

console.log("All remaining pages generated!");
