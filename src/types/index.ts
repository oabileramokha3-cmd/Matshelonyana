export type Role = 'customer' | 'driver' | 'owner';

export type CargoCategory = 
  | 'furniture'
  | 'appliances'
  | 'full_house'
  | 'office'
  | 'building_material'
  | 'commercial_heavy';

export type JobStatus = 
  | 'bidding'          // Open for driver offers / bids
  | 'accepted'         // Driver accepted / bid awarded
  | 'en_route_pickup'  // Driver driving to pickup point
  | 'cargo_loaded'     // Items loaded, strapped & verified
  | 'in_transit'       // Driving to destination
  | 'delivered'        // Arrived and unloaded
  | 'completed'        // Payment released & review submitted
  | 'cancelled';

export type TruckType = 
  | '1-Ton Bakkie (Hilux/D-Max)'
  | '3-Ton Drop-Side Truck'
  | '5-Ton Heavy Enclosed Van'
  | '8-Ton Flatbed Truck'
  | '12-Ton Multi-Axle Hauler';

export interface LocationPoint {
  name: string;
  suburb: string;
  address: string;
  coords: [number, number]; // [lat, lng]
  floorLevel: string; // e.g. "Ground Floor", "2nd Floor (No lift)"
  contactPhone: string;
}

export interface CargoItem {
  id: string;
  description: string;
  quantity: number;
  weightKgEstimate?: number;
  isFragile?: boolean;
}

export interface DriverBid {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  truckType: TruckType;
  truckPlate: string;
  rating: number;
  completedHauls: number;
  proposedFareBWP: number;
  helpersOffered: number;
  counterOfferNote?: string;
  etaMinutes: number;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MilestoneUpdate {
  status: JobStatus;
  label: string;
  timestamp: string;
  note?: string;
  photoUrl?: string;
  completed: boolean;
}

export interface Job {
  id: string;
  jobCode: string; // e.g. "MT-8902"
  title: string;
  category: CargoCategory;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  
  pickup: LocationPoint;
  dropoff: LocationPoint;
  
  scheduledType: 'immediate' | 'scheduled';
  scheduledTimeWindow?: string; // e.g. "Today 15:30 - 17:00"
  
  items: CargoItem[];
  totalWeightCategory: 'Light (<200kg)' | 'Medium (200-800kg)' | 'Heavy (800kg-2.5t)' | 'Extra Heavy (2.5t+)';
  helpersRequired: number; // 0, 1, 2, 3+
  specialInstructions?: string;
  itemPhotos: string[];
  
  customerProposedFareBWP: number; // inDrive style initial offer
  agreedFareBWP?: number;
  
  currentStatus: JobStatus;
  bids: DriverBid[];
  assignedDriverId?: string;
  assignedDriver?: DriverBid;
  
  currentDriverCoords?: [number, number];
  currentSpeedKmH?: number;
  estimatedArrivalMinutes?: number;
  routeProgressPercent?: number;
  
  milestones: MilestoneUpdate[];
  
  escrowStatus: 'unfunded' | 'held_in_escrow' | 'released' | 'refunded';
  escrowReleaseCode?: string;
  
  ratingGiven?: {
    stars: number;
    compliments: string[];
    reviewText: string;
    createdAt: string;
  };
  
  deliveryProof?: {
    receiverName: string;
    signatureDataUrl?: string;
    deliveredAt: string;
    photoProofUrl?: string;
  };

  createdAt: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver' | 'system';
  text: string;
  timestamp: string;
  isQuickAction?: boolean;
  coords?: [number, number];
}

export interface NotificationItem {
  id: string;
  type: 'push' | 'sms';
  title: string;
  message: string;
  timestamp: string;
  urgent: boolean;
  recipientPhone?: string;
  jobCode?: string;
  read: boolean;
}

export interface TransactionRecord {
  id: string;
  jobCode: string;
  transactionType: 'Escrow Hold' | 'Escrow Release' | 'Driver Payout (95%)' | 'App Owner 5% Commission' | 'Logistics Insurance' | 'Platform Service';
  amountBWP: number;
  fromParty: string;
  toParty: string;
  timestamp: string;
  paymentMethod: 'Orange Money' | 'Mascom MyZaka' | 'Absa / FNB Card' | 'EFT Bank Transfer';
  verificationHash: string; // SHA-256 digital signature
  status: 'Confirmed & Encrypted' | 'Processing';
}

export interface OfflineSyncQueueItem {
  id: string;
  action: 'UPDATE_JOB_STATUS' | 'ADD_MESSAGE' | 'UPLOAD_DELIVERY_PROOF' | 'SUBMIT_BID' | 'SUBMIT_DRIVER_APPLICATION';
  payload: any;
  queuedAt: string;
}

export interface DriverApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string; // Gaborone, Francistown, Maun, etc.
  omangNumber: string; // Botswana 9-digit Omang ID
  omangExpiry: string;
  omangDocName: string;
  omangDocUrl: string;
  licenceNumber: string;
  licenceClass: string;
  licenceExpiry: string;
  licenceDocName: string;
  licenceDocUrl: string;
  permitDocName: string;
  permitDocUrl: string;
  truckType: TruckType;
  truckMakeModel: string;
  truckPlate: string;
  truckYear: number;
  experienceYears: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}
