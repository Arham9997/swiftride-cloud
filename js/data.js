/* ===========================================================
   SwiftRide Cloud — Mock Data Layer
   Simulates the cloud backend (MongoDB Atlas + REST API) for
   demo purposes. Replace with real fetch() calls to your
   Express API when wiring up the backend.
   =========================================================== */

const SR_CITIES = [
  "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Chennai", "Delhi",
  "Jaipur", "Goa", "Ahmedabad", "Nagpur", "Indore", "Kochi"
];

const SR_OPERATORS = [
  "SwiftRide Express", "Orange Line Travels", "NavyArc Coaches",
  "SkyHop Volvo", "MetroLink Buses", "CloudCruiser Travels"
];

const SR_BUS_TYPES = ["AC Sleeper", "Non-AC Seater", "AC Seater", "Volvo Multi-Axle", "Electric AC"];

function srSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function srHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function generateBuses(source, destination, date) {
  const seed = srHash(`${source}-${destination}-${date}`) || 42;
  const rand = srSeededRandom(seed);
  const count = 6 + Math.floor(rand() * 5);
  const buses = [];
  for (let i = 0; i < count; i++) {
    const depHour = Math.floor(rand() * 24);
    const depMin = Math.floor(rand() * 4) * 15;
    const durationHrs = 4 + Math.floor(rand() * 10);
    const durationMin = Math.floor(rand() * 4) * 15;
    const arrTotal = depHour * 60 + depMin + durationHrs * 60 + durationMin;
    const arrHour = Math.floor(arrTotal / 60) % 24;
    const arrMin = arrTotal % 60;
    const type = SR_BUS_TYPES[Math.floor(rand() * SR_BUS_TYPES.length)];
    const operator = SR_OPERATORS[Math.floor(rand() * SR_OPERATORS.length)];
    const totalSeats = type.includes("Sleeper") ? 30 : 40;
    const bookedCount = Math.floor(rand() * (totalSeats * 0.7));
    const fare = 350 + Math.floor(rand() * 1400);
    const rating = (3.4 + rand() * 1.6).toFixed(1);
    buses.push({
      id: `SR-${seed}-${i}`,
      operator,
      type,
      source, destination, date,
      depTime: `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`,
      arrTime: `${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      duration: `${durationHrs}h ${durationMin}m`,
      totalSeats,
      availableSeats: totalSeats - bookedCount,
      bookedCount,
      fare,
      rating,
      amenities: ["WiFi", "Charging Point", "Water Bottle", "Blanket"].filter((_, idx) => rand() > 0.3 || idx === 0),
      cancellation: rand() > 0.4 ? "Free cancellation till 6 hrs before" : "Partial refund only"
    });
  }
  return buses.sort((a, b) => a.depTime.localeCompare(b.depTime));
}

function generateSeatMap(bus) {
  const seed = srHash(bus.id);
  const rand = srSeededRandom(seed);
  const isSleeper = bus.type.includes("Sleeper");
  const rows = isSleeper ? 10 : 10;
  const seats = [];
  let seatNum = 0;
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const seatsInRow = isSleeper ? 3 : 4;
    for (let c = 0; c < seatsInRow; c++) {
      seatNum++;
      const isAisle = !isSleeper && c === 2;
      const gender = rand() > 0.78 ? (rand() > 0.5 ? "F" : "M") : null;
      const booked = seatNum <= bus.bookedCount && rand() > 0.15;
      seats.push({
        code: `${rowLetter}${c + 1}`,
        row: r, col: c,
        deck: isSleeper ? (r < 5 ? "lower" : "upper") : "main",
        booked,
        gender: booked ? gender : null,
        price: bus.fare + (isSleeper && r >= 5 ? 80 : 0),
        isAisleGapAfter: isAisle
      });
    }
  }
  return seats;
}

function srFormatCurrency(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function srGenerateBookingId() {
  return "SRC" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
}

function srGetBookings() {
  try { return JSON.parse(localStorage.getItem("sr_bookings") || "[]"); } catch { return []; }
}
function srSaveBooking(booking) {
  const all = srGetBookings();
  all.unshift(booking);
  localStorage.setItem("sr_bookings", JSON.stringify(all));
}
function srGetCurrentBookingDraft() {
  try { return JSON.parse(sessionStorage.getItem("sr_draft") || "null"); } catch { return null; }
}
function srSaveDraft(draft) {
  sessionStorage.setItem("sr_draft", JSON.stringify(draft));
}

const SR_REVIEWS = [
  { name: "Aarav Mehta", route: "Mumbai → Pune", rating: 5, text: "Boarding point was exactly where the app said. Bus left on time and the seat was genuinely comfortable for a 3-hour ride." },
  { name: "Priya Nair", route: "Bengaluru → Chennai", rating: 5, text: "Got a refund processed within minutes after I had to cancel. Didn't expect it to be that quick, honestly." },
  { name: "Rohan Kulkarni", route: "Delhi → Jaipur", rating: 4, text: "Live tracking matched reality within a couple of minutes the whole trip. Useful for planning when to leave for the stop." },
  { name: "Sneha Iyer", route: "Hyderabad → Goa", rating: 5, text: "Switched seats twice while booking and the price updated instantly. Checkout with UPI took under a minute." },
  { name: "Vikram Singh", route: "Ahmedabad → Mumbai", rating: 4, text: "Driver details and bus number were sent the night before, made it easy to spot at a busy terminal." },
  { name: "Anjali Desai", route: "Chennai → Kochi", rating: 5, text: "Digital ticket with the QR code scanned instantly at boarding, no need to dig through email." }
];

const SR_FAQS = [
  { q: "How do I cancel or reschedule a ticket?", a: "Open Booking History from your dashboard, select the trip, and choose Cancel or Reschedule. Refunds for eligible cancellations are processed back to your original payment method within 3-5 business days." },
  { q: "Is my payment information stored securely?", a: "Card details are never stored on SwiftRide Cloud servers. Payments are tokenized and processed through PCI-DSS compliant gateways, and every session is protected with JWT-based authentication." },
  { q: "Can I track my bus in real time?", a: "Yes. Once your trip is confirmed, the Live Tracking tab on your ticket shows the bus's current position, updated boarding point ETA, and any schedule changes from the operator." },
  { q: "What happens if my bus is delayed?", a: "You'll get a notification as soon as the operator updates the schedule. If a delay exceeds the threshold set by the operator's policy, you can request a partial refund directly from the booking." },
  { q: "Do I need to print my ticket?", a: "No. Your digital ticket includes a QR code that conductors can scan directly from your phone. You can still download a PDF copy from Booking History if you prefer a printed copy." },
  { q: "How are seat genders shown on the seat map?", a: "Operators following women-only seat policies on certain routes mark reserved seats with a gender tag on the seat map so you can choose accordingly before payment." }
];
