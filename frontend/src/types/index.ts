export interface Offer {
  id: number;
  businessId: number;
  businessName: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  maxBookingPerCustomer: number;
  terms: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Slot {
  id: number;
  offerId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableCount: number;
  status: string;
}

export interface Booking {
  id: number;
  offerSlotId: number;
  offerId: number;
  offerTitle: string;
  slotDate: string;
  slotStartTime: string;
  bookingReference: string;
  customerName: string;
  phone: string;
  email: string;
  numberOfPeople: number;
  specialNote?: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface RecentBooking {
  customerName: string;
  offerTitle: string;
  bookingReference: string;
  numberOfPeople: number;
  status: string;
}

export interface DashboardSummary {
  totalOffers: number;
  totalBookings: number;
  activeOffers: number;
  totalRevenue: number;
  todayBookings: number;
  totalCapacity: number;
  totalBooked: number;
  totalAvailable: number;
  conversionRate: number;
  recentBookings: RecentBooking[];
}
