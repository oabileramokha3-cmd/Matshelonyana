import { Job, DriverBid, TransactionRecord, NotificationItem, ChatMessage, DriverApplication } from '../types';

export const BOTSWANA_LOCATIONS = [
  { name: 'Phakalane Suburb, Ext 2', suburb: 'Phakalane', coords: [-24.582, 25.962] as [number, number] },
  { name: 'Broadhurst Industrial, Plot 1024', suburb: 'Broadhurst', coords: [-24.628, 25.922] as [number, number] },
  { name: 'Gaborone CBD, iTowers & Square', suburb: 'CBD', coords: [-24.654, 25.908] as [number, number] },
  { name: 'Block 6 Residential, Near BBS Mall', suburb: 'Block 6', coords: [-24.636, 25.882] as [number, number] },
  { name: 'Tlokweng Main Rd, Plot 441', suburb: 'Tlokweng', coords: [-24.672, 25.965] as [number, number] },
  { name: 'Mogoditshane Heavy Hardware Yard', suburb: 'Mogoditshane', coords: [-24.649, 25.861] as [number, number] },
  { name: 'Block 8 Commercial Complex', suburb: 'Block 8', coords: [-24.618, 25.895] as [number, number] },
  { name: 'Gaborone West Phase 4, Plot 908', suburb: 'G-West', coords: [-24.668, 25.891] as [number, number] },
];

export const AVAILABLE_DRIVERS: DriverBid[] = [
  {
    id: 'drv-kgosi-01',
    driverId: 'drv-kgosi-01',
    driverName: 'Kgosi Mogorosi',
    driverPhone: '+267 72 419 802',
    driverAvatar: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
    truckType: '1-Ton Bakkie (Hilux/D-Max)',
    truckPlate: 'B 492 BAZ',
    rating: 4.95,
    completedHauls: 284,
    proposedFareBWP: 450,
    helpersOffered: 2,
    counterOfferNote: 'Available right away. I have protective moving blankets, foam wraps and ratcheting tie-down straps.',
    etaMinutes: 8,
    submittedAt: '10 mins ago',
    status: 'pending'
  },
  {
    id: 'drv-thabo-02',
    driverId: 'drv-thabo-02',
    driverName: 'Thabo Tau',
    driverPhone: '+267 71 855 340',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    truckType: '3-Ton Drop-Side Truck',
    truckPlate: 'B 118 BDW',
    rating: 4.88,
    completedHauls: 196,
    proposedFareBWP: 520,
    helpersOffered: 2,
    counterOfferNote: 'Can handle stairs and tight doorways. Comes with hydraulic tail lift for heavy items.',
    etaMinutes: 14,
    submittedAt: '6 mins ago',
    status: 'pending'
  },
  {
    id: 'drv-oteng-03',
    driverId: 'drv-oteng-03',
    driverName: 'Oteng Setlhako',
    driverPhone: '+267 75 992 108',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    truckType: '5-Ton Heavy Enclosed Van',
    truckPlate: 'B 776 BGH',
    rating: 5.0,
    completedHauls: 312,
    proposedFareBWP: 650,
    helpersOffered: 3,
    counterOfferNote: 'Fully weatherproof enclosed box van. Ideal for premium furniture and rain protection.',
    etaMinutes: 20,
    submittedAt: '3 mins ago',
    status: 'pending'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-live-01',
    jobCode: 'MT-9024',
    title: '3-Piece Genuine Leather L-Shape Sofa & 8-Seater Hardwood Table',
    category: 'furniture',
    customerId: 'cust-amantle',
    customerName: 'Amantle Kgari',
    customerPhone: '+267 74 120 983',
    customerAvatar: '/src/assets/images/avatar_customer_amantle_1790988358805.jpg',
    pickup: {
      name: 'Broadhurst Residential Plot 142',
      suburb: 'Broadhurst Ext 16',
      address: 'Plot 142 Maratadiba Way, Broadhurst',
      coords: [-24.628, 25.922],
      floorLevel: 'Ground Floor Verandah',
      contactPhone: '+267 74 120 983'
    },
    dropoff: {
      name: 'Phakalane Villa 4B',
      suburb: 'Phakalane',
      address: 'Villa 4B Acacia Drive, Phakalane',
      coords: [-24.582, 25.962],
      floorLevel: '1st Floor Master Lounge (Spacious Stairwell)',
      contactPhone: '+267 74 120 983'
    },
    scheduledType: 'immediate',
    items: [
      { id: 'item-1', description: '3-Piece Leather L-Shape Couch', quantity: 1, weightKgEstimate: 140, isFragile: false },
      { id: 'item-2', description: 'Solid Teak Dining Table & 8 Chairs', quantity: 1, weightKgEstimate: 110, isFragile: true },
      { id: 'item-3', description: 'Tempered Glass Coffee Table', quantity: 1, weightKgEstimate: 35, isFragile: true }
    ],
    totalWeightCategory: 'Medium (200-800kg)',
    helpersRequired: 2,
    specialInstructions: 'Please ensure blankets are used on the wood edges so it does not scratch during transit on A1.',
    itemPhotos: [
      '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg'
    ],
    customerProposedFareBWP: 480,
    agreedFareBWP: 480,
    currentStatus: 'in_transit',
    bids: [],
    assignedDriverId: 'drv-kgosi-01',
    assignedDriver: AVAILABLE_DRIVERS[0],
    currentDriverCoords: [-24.605, 25.942],
    currentSpeedKmH: 52,
    estimatedArrivalMinutes: 9,
    routeProgressPercent: 65,
    milestones: [
      { status: 'accepted', label: 'Bid Accepted & Driver Dispatched', timestamp: '14:10', completed: true },
      { status: 'en_route_pickup', label: 'Arrived at Broadhurst Pickup', timestamp: '14:24', completed: true },
      { status: 'cargo_loaded', label: 'Items Strapped & Cargo Verified', timestamp: '14:42', completed: true },
      { status: 'in_transit', label: 'In Transit via A1 Dual Carriageway', timestamp: '14:48', completed: true },
      { status: 'delivered', label: 'Arrived at Destination & Unloaded', timestamp: 'Pending', completed: false }
    ],
    escrowStatus: 'held_in_escrow',
    escrowReleaseCode: '6824',
    createdAt: '2026-10-02 14:02'
  },
  {
    id: 'job-bid-02',
    jobCode: 'MT-4188',
    title: 'Double-Door Stainless Steel Fridge & Heavy Top-Loader Machine',
    category: 'appliances',
    customerId: 'cust-amantle',
    customerName: 'Amantle Kgari',
    customerPhone: '+267 74 120 983',
    customerAvatar: '/src/assets/images/avatar_customer_amantle_1790988358805.jpg',
    pickup: {
      name: 'Block 6 Shopping Complex Apt',
      suburb: 'Block 6',
      address: 'Flat 12, Plot 8991, Block 6 Gaborone',
      coords: [-24.636, 25.882],
      floorLevel: '2nd Floor (Requires 2 strong helpers)',
      contactPhone: '+267 74 120 983'
    },
    dropoff: {
      name: 'Tlokweng Riverview Cottage',
      suburb: 'Tlokweng',
      address: 'Plot 311, Riverview Ward, Tlokweng',
      coords: [-24.672, 25.965],
      floorLevel: 'Ground Floor Kitchen',
      contactPhone: '+267 74 120 983'
    },
    scheduledType: 'immediate',
    items: [
      { id: 'item-fridge', description: 'Samsung 520L French Door Fridge', quantity: 1, weightKgEstimate: 105, isFragile: true },
      { id: 'item-washer', description: 'Defy 13kg Top-Load Washing Machine', quantity: 1, weightKgEstimate: 60, isFragile: false }
    ],
    totalWeightCategory: 'Light (<200kg)',
    helpersRequired: 2,
    specialInstructions: 'Fridge must remain standing upright at all times so compressor oil does not leak.',
    itemPhotos: [],
    customerProposedFareBWP: 350,
    currentStatus: 'bidding',
    bids: [
      {
        id: 'bid-1',
        driverId: 'drv-thabo-02',
        driverName: 'Thabo Tau',
        driverPhone: '+267 71 855 340',
        driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        truckType: '3-Ton Drop-Side Truck',
        truckPlate: 'B 118 BDW',
        rating: 4.88,
        completedHauls: 196,
        proposedFareBWP: 420,
        helpersOffered: 2,
        counterOfferNote: 'I offer P420 because 2nd floor stairs with a 105kg French-door fridge needs two professional lifters with harness straps.',
        etaMinutes: 12,
        submittedAt: '5 mins ago',
        status: 'pending'
      },
      {
        id: 'bid-2',
        driverId: 'drv-oteng-03',
        driverName: 'Oteng Setlhako',
        driverPhone: '+267 75 992 108',
        driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        truckType: '5-Ton Heavy Enclosed Van',
        truckPlate: 'B 776 BGH',
        rating: 5.0,
        completedHauls: 312,
        proposedFareBWP: 380,
        helpersOffered: 2,
        counterOfferNote: 'I accept P380. I am nearby in Block 8 and can reach Block 6 in 10 minutes.',
        etaMinutes: 10,
        submittedAt: '2 mins ago',
        status: 'pending'
      }
    ],
    milestones: [],
    escrowStatus: 'unfunded',
    createdAt: '2026-10-02 14:30'
  },
  {
    id: 'job-sched-03',
    jobCode: 'MT-7512',
    title: '50 Bags Rhino Bedding Cement & Aluminum Roofing Trusses',
    category: 'building_material',
    customerId: 'cust-barolong',
    customerName: 'Barolong Motsepe',
    customerPhone: '+267 73 990 124',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    pickup: {
      name: 'Mogoditshane Heavy Hardware Yard',
      suburb: 'Mogoditshane',
      address: 'Plot 710, Molepolole Highway',
      coords: [-24.649, 25.861],
      floorLevel: 'Warehouse Loading Dock A',
      contactPhone: '+267 73 990 124'
    },
    dropoff: {
      name: 'Block 8 Construction Site',
      suburb: 'Block 8',
      address: 'Plot 40992, Extension 37',
      coords: [-24.618, 25.895],
      floorLevel: 'Building Foundation Platform',
      contactPhone: '+267 73 990 124'
    },
    scheduledType: 'scheduled',
    scheduledTimeWindow: 'Tomorrow 08:00 - 10:00 AM',
    items: [
      { id: 'item-c1', description: '50kg Cement Bags', quantity: 50, weightKgEstimate: 2500, isFragile: false },
      { id: 'item-c2', description: '6-Meter Aluminum Trusses', quantity: 12, weightKgEstimate: 180, isFragile: false }
    ],
    totalWeightCategory: 'Extra Heavy (2.5t+)',
    helpersRequired: 3,
    specialInstructions: 'Requires heavy 5-Ton or 8-Ton truck. Yard forklift available at pickup only.',
    itemPhotos: [],
    customerProposedFareBWP: 950,
    agreedFareBWP: 1100,
    currentStatus: 'cargo_loaded',
    bids: [],
    assignedDriverId: 'drv-oteng-03',
    assignedDriver: AVAILABLE_DRIVERS[2],
    milestones: [
      { status: 'accepted', label: 'Bid Accepted by Driver', timestamp: '12:00', completed: true },
      { status: 'cargo_loaded', label: 'Loaded with Forklift & Tarpaulin tied', timestamp: '13:15', completed: true }
    ],
    escrowStatus: 'held_in_escrow',
    escrowReleaseCode: '9103',
    createdAt: '2026-10-02 11:45'
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-001',
    jobCode: 'MT-9024',
    transactionType: 'Escrow Hold',
    amountBWP: 480.00,
    fromParty: 'Amantle Kgari (Orange Money)',
    toParty: 'Matshelonyana Digital Escrow Vault',
    timestamp: '2026-10-02 14:12:05',
    paymentMethod: 'Orange Money',
    verificationHash: '0x8f2a1b9c7e3d5a440182cfa230e9d1f56b270a4176cf982e0db7ac1834923e',
    status: 'Confirmed & Encrypted'
  },
  {
    id: 'tx-002',
    jobCode: 'MT-7512',
    transactionType: 'Escrow Hold',
    amountBWP: 1100.00,
    fromParty: 'Barolong Motsepe (FNB Card)',
    toParty: 'Matshelonyana Digital Escrow Vault',
    timestamp: '2026-10-02 12:04:19',
    paymentMethod: 'Absa / FNB Card',
    verificationHash: '0x43b819f7a932d001fe91ca8e58bc103984af9320e1cd56ba90123fe57492c1',
    status: 'Confirmed & Encrypted'
  },
  {
    id: 'tx-003',
    jobCode: 'MT-8810',
    transactionType: 'Driver Payout (95%)',
    amountBWP: 589.00,
    fromParty: 'Matshelonyana Digital Escrow Vault',
    toParty: 'Oteng Setlhako (Mascom MyZaka)',
    timestamp: '2026-10-01 17:40:22',
    paymentMethod: 'Mascom MyZaka',
    verificationHash: '0x71e9a3b8cd20f145892301fae56b409218cba47e923450fd123490ba7812ef',
    status: 'Confirmed & Encrypted'
  },
  {
    id: 'tx-004',
    jobCode: 'MT-8810',
    transactionType: 'App Owner 5% Commission',
    amountBWP: 31.00,
    fromParty: 'Trip MT-8810 Escrow Release (5% Cut)',
    toParty: 'Matshelonyana App Owner Treasury Account',
    timestamp: '2026-10-01 17:40:23',
    paymentMethod: 'Orange Money',
    verificationHash: '0x1928374a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcd',
    status: 'Confirmed & Encrypted'
  }
];

export const INITIAL_DRIVER_APPLICATIONS: DriverApplication[] = [
  {
    id: 'app-01',
    fullName: 'Kefentse Dibeela',
    phone: '+267 72 890 114',
    email: 'kdibeela@botsnet.bw',
    city: 'Gaborone (Broadhurst)',
    omangNumber: '392019401',
    omangExpiry: '2030-08-14',
    omangDocName: 'Omang_National_ID_Front_Back_Kefentse.pdf',
    omangDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    licenceNumber: 'DL-BW-88219',
    licenceClass: 'Class C1 (3-Ton Truck & Goods)',
    licenceExpiry: '2028-11-20',
    licenceDocName: 'Drivers_Licence_PrDP_Goods_Kefentse.pdf',
    licenceDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    permitDocName: 'DRTS_Public_Carrier_Permit_2026.pdf',
    permitDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    truckType: '3-Ton Drop-Side Truck',
    truckMakeModel: 'Toyota Dyna 4-093 Drop-Side',
    truckPlate: 'B 542 BDF',
    truckYear: 2021,
    experienceYears: 7,
    status: 'pending',
    submittedAt: 'Today at 10:15 AM'
  },
  {
    id: 'app-02',
    fullName: 'Mpho Moroka',
    phone: '+267 75 441 908',
    email: 'mphomoroka90@gmail.com',
    city: 'Francistown (Light Industrial)',
    omangNumber: '518392104',
    omangExpiry: '2029-05-19',
    omangDocName: 'Omang_ID_Card_MphoMoroka.pdf',
    omangDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    licenceNumber: 'DL-BW-66012',
    licenceClass: 'Class B (Light Motor Vehicle & 1-Ton Bakkie)',
    licenceExpiry: '2027-04-12',
    licenceDocName: 'Botswana_Drivers_Licence_ClassB_Mpho.pdf',
    licenceDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    permitDocName: 'Commercial_Goods_Permit_FT.pdf',
    permitDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    truckType: '1-Ton Bakkie (Hilux/D-Max)',
    truckMakeModel: 'Isuzu D-Max 250 Fleetside',
    truckPlate: 'B 719 BKA',
    truckYear: 2022,
    experienceYears: 4,
    status: 'pending',
    submittedAt: 'Today at 08:30 AM'
  },
  {
    id: 'app-03',
    fullName: 'Kgosi Mogorosi',
    phone: '+267 72 419 802',
    email: 'kgosi.mogorosi@haulage.bw',
    city: 'Gaborone (CBD & Tlokweng)',
    omangNumber: '492019284',
    omangExpiry: '2031-10-05',
    omangDocName: 'Omang_Verified_Kgosi.pdf',
    omangDocUrl: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
    licenceNumber: 'DL-BW-99021',
    licenceClass: 'Class B & PrDP Goods Transport',
    licenceExpiry: '2029-01-15',
    licenceDocName: 'Licence_PrDP_Verified.pdf',
    licenceDocUrl: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
    permitDocName: 'DRTS_Carrier_Permit_Kgosi.pdf',
    permitDocUrl: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
    truckType: '1-Ton Bakkie (Hilux/D-Max)',
    truckMakeModel: 'Toyota Hilux 2.4 GD-6 Single Cab',
    truckPlate: 'B 492 BAZ',
    truckYear: 2023,
    experienceYears: 8,
    status: 'approved',
    submittedAt: '3 days ago',
    reviewedAt: '2 days ago'
  },
  {
    id: 'app-04',
    fullName: 'Bame Tau',
    phone: '+267 71 330 921',
    email: 'bametau@yahoo.com',
    city: 'Maun',
    omangNumber: '129039102',
    omangExpiry: '2024-02-10', // Expired
    omangDocName: 'Omang_Expired_Scan.pdf',
    omangDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    licenceNumber: 'DL-BW-44109',
    licenceClass: 'Class B',
    licenceExpiry: '2026-12-01',
    licenceDocName: 'Licence_Bame.pdf',
    licenceDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    permitDocName: 'Permit_Maun.pdf',
    permitDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
    truckType: '1-Ton Bakkie (Hilux/D-Max)',
    truckMakeModel: 'Ford Ranger 2.2 TDCi',
    truckPlate: 'B 104 BMN',
    truckYear: 2018,
    experienceYears: 2,
    status: 'rejected',
    rejectionReason: 'National Identity (Omang) card expired in February 2024. Please renew with Ministry of Labour & Home Affairs and re-upload valid document.',
    submittedAt: 'Yesterday',
    reviewedAt: 'Yesterday'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'push',
    title: 'Truck On The Move: A1 Highway',
    message: 'Kgosi Mogorosi is 9 minutes away from Phakalane with your leather couch & teak table.',
    timestamp: '2 mins ago',
    urgent: true,
    jobCode: 'MT-9024',
    read: false
  },
  {
    id: 'notif-2',
    type: 'sms',
    title: 'SMS Sent to +267 74 120 983',
    message: '[Matshelonyana Logistics]: Your driver Kgosi has verified cargo straps and departed Broadhurst. Live tracker: matshelonyana.bw/track/MT-9024',
    timestamp: '6 mins ago',
    urgent: true,
    recipientPhone: '+267 74 120 983',
    jobCode: 'MT-9024',
    read: true
  },
  {
    id: 'notif-3',
    type: 'push',
    title: 'New inDrive Counter-Offer: P380.00',
    message: 'Driver Oteng Setlhako submitted a bid of P380 with 2 helpers for your Fridge & Washing Machine haul.',
    timestamp: '12 mins ago',
    urgent: false,
    jobCode: 'MT-4188',
    read: true
  }
];

export const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  'job-live-01': [
    {
      id: 'c1',
      jobId: 'job-live-01',
      senderId: 'drv-kgosi-01',
      senderName: 'Kgosi (Driver)',
      senderRole: 'driver',
      text: 'Dumela Mme Amantle! I have arrived at your Broadhurst gate. I have my helper Kago with me.',
      timestamp: '14:24'
    },
    {
      id: 'c2',
      jobId: 'job-live-01',
      senderId: 'cust-amantle',
      senderName: 'Amantle (Customer)',
      senderRole: 'customer',
      text: 'Dumela Rra! Buzzing you in right now. The sofa is wrapped, but please take extra care with the teak dining table glass top.',
      timestamp: '14:25'
    },
    {
      id: 'c3',
      jobId: 'job-live-01',
      senderId: 'drv-kgosi-01',
      senderName: 'Kgosi (Driver)',
      senderRole: 'driver',
      text: 'Noted! We have double-padded moving quilts and ratchets on the bakkie. Everything is tightly secured now, we are hitting the A1 dual carriageway toward Phakalane.',
      timestamp: '14:43'
    }
  ]
};
