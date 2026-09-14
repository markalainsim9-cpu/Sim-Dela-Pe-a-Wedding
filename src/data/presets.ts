import { EventConfig, Guest, GuestbookEntry, CloudAccountSettings } from '../types';

export const EVENT_PRESETS: Record<string, EventConfig> = {
  wedding: {
    name: 'Romantic Dusty Blue Wedding',
    logoText: 'MARK & KARLA',
    logoIcon: '❦',
    subHeader: 'Together with their families',
    subHeaderEnabled: true,
    invitationLine: 'Invite you to share in the joy of the marriage of',
    title: 'Mark & Karla',
    description: 'Join us as we exchange sacred vows and celebrate our love surrounded by our dearest family and friends.',
    countdownTitle: 'Days Until The Celebration',
    timezone: 'PST',
    date: 'Saturday, March 20, 2027',
    time: '2:00 PM PST',
    venue: "Cai's Garden & Events",
    venueEnabled: true,
    venueEyebrow: 'The Celebration Grounds',
    venueTitle: '',
    venueSubtitle: 'Join us amid timeless coastal gardens and candlelit historic halls.',
    address: 'Gracia Village, Santo Domingo, Urdaneta City, Pangasinan',
    venueImg: 'https://iili.io/nKVZvxp.jpg',
    mapLink: 'https://maps.app.goo.gl/sRA7oJgjRwtNhsk86',
    venueNotes: 'Valet and guest parking are available on-site at the estate entrance. Shuttle vans operate continuously between the sanctuary and celebration grounds.',
    deadline: 'March 10, 2027',
    targetDate: '2027-03-20T14:00',
    // Formal Invitation Slideshow Suite
    invitationEnabled: true,
    invitationEyebrow: 'Formal Suite & Stationery',
    invitationTitle: 'The Wedding Invitation Suite',
    invitationSubtitle: 'Swipe through our formal letterpress invitation suite, ceremony details, and celebration guide.',
    invitationImages: [
      {
        id: '6aa25361ead997d09a45db42',
        url: 'https://ik.imagekit.io/9abzbu5ke/wedding-invitations/Blue_Pink_and_White_Elegant_Wedding_Invitation_oNkyA6gnh.png',
        title: 'Blue Pink and White Elegant Wedding Invitation',
        caption: 'Uploaded via ImageKit.io CDN'
      },
      {
        id: 'sample-2',
        url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=80',
        title: 'The Holy Matrimony & Order of Service',
        caption: 'Sacred ceremony liturgy, scriptures, and processional order at St. Mary’s Catholic Sanctuary.'
      },
      {
        id: 'sample-3',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        title: 'Celebration Grounds & Reception Banquet',
        caption: 'Evening gala under the starlit glasshouse, dress code guidelines, and celebration timeline.'
      }
    ],
    // Wedding Church & Ceremony Venue
    churchEnabled: true,
    churchEyebrow: 'The Holy Matrimony',
    churchTitle: 'The Church Ceremony',
    churchSubtitle: 'Join us as we exchange sacred vows and unite in holy matrimony.',
    churchName: 'Holy Cross Parish Church',
    churchTime: '2:00 PM PST',
    churchAddress: 'Poblacion, Laoac, Pangasinan',
    churchImg: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    churchMapLink: 'https://maps.app.goo.gl/aJMBZP7jAmqRHjAs6',
    churchNotes: 'Guests are kindly requested to be seated 15 minutes before the processional. Complimentary parking is available outside and in-front of the sanctuary.',
    // Keepsake Guestbook
    guestbookEnabled: true,
    guestbookPostingEnabled: true,
    guestbookEyebrow: 'Keepsake Guestbook',
    guestbookTitle: 'Wishes & Blessings',
    guestbookSubtitle: 'Leave a warm message, blessing, or cherished memory for Mark and Karla.',
    // Gift & QR Display Registry Suite
    giftEnabled: true,
    giftEyebrow: 'Wedding Registry & Blessings',
    giftTitle: 'Monetary Gift & Blessings',
    giftSubtitle: 'Your presence and love on our special day are the greatest gifts of all. Should you wish to honor us with a gift, a monetary blessing is warmly appreciated.',
    giftQrImage: 'https://images.unsplash.com/photo-1595079672139-545c60e557b7?auto=format&fit=crop&w=600&q=80',
    giftBankName: 'GCash',
    giftAccountName: 'Mark Alain Sim & Karla',
    giftAccountNumber: '0917-888-2027',
    giftNotes: 'Kindly include your name in the payment reference or note so we can express our deepest gratitude!',
    giftQrList: [
      {
        id: 'qr_gcash_1',
        bankName: 'GCash',
        accountName: 'Mark Alain Sim & Karla',
        accountNumber: '0917-888-2027',
        qrImage: 'https://images.unsplash.com/photo-1595079672139-545c60e557b7?auto=format&fit=crop&w=600&q=80',
        notes: 'GCash express send or QR scan. Please put your name in the note!'
      },
      {
        id: 'qr_maya_2',
        bankName: 'Maya / PayMaya',
        accountName: 'Karla & Mark Alain',
        accountNumber: '0917-555-1428',
        qrImage: 'https://images.unsplash.com/photo-1595079672139-545c60e557b7?auto=format&fit=crop&w=600&q=80',
        notes: 'Maya / PayMaya wallet or bank transfer.'
      }
    ],
    heroImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80',
    bgImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80',
    audioUrl: 'https://mp3tourl.com/audio/1788958851227-5e1cfd51-4a86-4f84-87e3-dbfb9e2c57b9.mp3',
    themeColor: 'dusty-blue',
    timeline: [
      { id: '1', time: '3:30 PM', title: 'The Arrival & Harp Prelude', desc: 'Gentle champagne welcome and classical harp serenade on the Rose Terrace.' },
      { id: '2', time: '4:00 PM', title: 'The Exchange of Vows', desc: 'Sacred ceremony under the heirloom wisteria arch overlooking the Atlantic.' },
      { id: '3', time: '5:00 PM', title: 'Cocktails & Golden Hour', desc: 'Violin ensemble, signature elderflower spritzers & artisan canapés.' },
      { id: '4', time: '6:30 PM', title: 'Candlelit Grand Banquet', desc: 'Four-course plated dinner, vintage champagne toasts & cake cutting.' },
      { id: '5', time: '8:30 PM', title: 'First Dance & Starlight Ball', desc: 'Grand ballroom waltz and dancing with the ten-piece live orchestra.' },
      { id: '6', time: '11:00 PM', title: 'Luminous Sparkler Farewell', desc: 'A sparkling tunnel send-off under the midnight sky.' }
    ],
    totalTables: 10,
    seatsPerTable: 8,
    leavesAnimationEnabled: true,
    leavesStyle: 'gilded',
    leavesDensity: 'lush',
    titleFont: 'great-vibes',
    titleWeight: 'light',
    titleItalic: false,
    titleTransform: 'none',
    titleTracking: 'normal',
    titleSize: 'compact',
    hostPassword: 'karla123'
  }
};

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g1',
    name: 'Emily Watson',
    email: 'emily@example.com',
    attending: 'yes',
    count: 2,
    song: 'At Last - Etta James',
    table: 'Table 1',
    seat: 'Seat 1',
    note: 'So thrilled for both of you!',
    createdAt: '2027-08-01T10:00:00Z'
  },
  {
    id: 'g2',
    name: 'Michael Chang',
    email: 'mchang@example.com',
    attending: 'yes',
    count: 1,
    song: 'L-O-V-E - Nat King Cole',
    table: 'Table 1',
    seat: 'Seat 3',
    note: 'Wouldn\'t miss it for the world.',
    createdAt: '2027-08-02T14:30:00Z'
  },
  {
    id: 'g3',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    attending: 'no',
    count: 0,
    song: '-',
    table: '-',
    seat: '-',
    note: 'Sending all our warmest love from abroad!',
    createdAt: '2027-08-03T09:15:00Z'
  },
  {
    id: 'g4',
    name: 'Julian Montgomery',
    email: 'julian@example.com',
    attending: 'yes',
    count: 2,
    song: 'Stand By Me - Ben E. King',
    table: 'Table 2',
    seat: 'Seat 1',
    note: 'Looking forward to the celebration!',
    createdAt: '2027-08-04T16:20:00Z'
  },
  {
    id: 'g5',
    name: 'Claire Bennett',
    email: 'claire@example.com',
    attending: 'yes',
    count: 2,
    song: 'Make You Feel My Love - Adele',
    table: 'Table 3',
    seat: 'Seat 1',
    note: 'So excited to celebrate Mark and Karla\'s special day!',
    createdAt: '2027-08-05T11:00:00Z'
  }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Clara & David Thornton',
    message: 'May your marriage be filled with all the right ingredients: a heap of love, a dash of humor, a touch of romance, and a spoonful of understanding. So overjoyed for Mark and Karla!',
    relationship: 'Family Friends',
    createdAt: '2027-08-10T14:20:00Z',
    timestamp: 1817907600000
  },
  {
    id: 'gb-2',
    name: 'Julian Vance',
    message: 'Wishing you a lifetime of quiet mornings, spontaneous adventures, and dancing in the kitchen together. You two are truly made for each other!',
    relationship: 'Best Man',
    createdAt: '2027-08-12T19:45:00Z',
    timestamp: 1818100000000
  },
  {
    id: 'gb-3',
    name: 'Elena Rostova',
    message: 'To a lifetime of shared laughter and unconditional love. Seeing you two at the altar brought tears of pure happiness. Congratulations Mark and Karla!',
    relationship: 'Maid of Honor',
    createdAt: '2027-08-15T11:10:00Z',
    timestamp: 1818328200000
  },
  {
    id: 'gb-4',
    name: 'Grace & Thomas Sterling',
    message: 'Watching you grow together into such a devoted and loving couple has been the greatest joy. May God bless your sacred union forever.',
    relationship: 'Grandparents of the Bride',
    createdAt: '2027-08-16T16:30:00Z',
    timestamp: 1818433800000
  }
];

export const INITIAL_CLOUD_SETTINGS: CloudAccountSettings = {
  "version": "3.0",
  "exportedAt": "2026-09-14T03:23:52.930Z",
  "firebase": {
    "projectId": "gen-lang-client-0018083516",
    "firestoreDatabaseId": "ai-studio-remixremixreeven-f3bdd371-0727-4153-ad53-32f81493a70b",
    "appId": "1:242223241649:web:ab85d85dac2afa2e464590",
    "apiKey": "AIzaSyCESyH98VhJsvP43BvjWLXciU8ZZD1rARE",
    "authDomain": "gen-lang-client-0018083516.firebaseapp.com",
    "storageBucket": "gen-lang-client-0018083516.firebasestorage.app",
    "messagingSenderId": "242223241649",
    "oAuthClientId": "242223241649-3c2kug3eg6inl92q89b3vrouun9imfl0.apps.googleusercontent.com",
    "plan": "Spark Plan (Free Tier)",
    "consoleUrl": "https://console.firebase.google.com/project/gen-lang-client-0018083516/firestore",
    "databaseMode": "Firestore Native (Authoritative Server-Sent Events + Live Web SDK Sync)"
  },
  "supabase": {
    "supabaseUrl": "https://icfspyvyavvcgofxgnsf.supabase.co",
    "supabaseAnonKey": "sb_publishable_m-JlgMYjemUxSz_Pe1bc5Q_0XuCu_C5",
    "mode": "failover",
    "autoFailover": true,
    "lastSyncTime": "2026-09-12T15:55:38.367Z",
    "redundancyPolicy": {
      "mode": "failover",
      "autoFailover": true,
      "projectRef": "icfspyvyavvcgofxgnsf",
      "policyDescription": "Warm Standby High-Availability Failover Active: Cloud Firestore is the primary authoritative source. If Firestore encounters quota limits (Spark 50k reads / 20k writes), connection timeouts (>10s), or 503 service downtime, clients automatically fail over to Supabase PostgreSQL.",
      "failoverTriggers": [
        "Firestore Spark free-tier daily quotas reached (50,000 document reads / 20,000 writes per day)",
        "Network partition or unhandled client disconnection exceeding 10 seconds",
        "Backend server HTTP 503 / 504 gateway degradation or cold restart",
        "Manual operator toggle in Cloud Settings Modal"
      ],
      "synchronizedTables": [
        "wedding_config",
        "guests",
        "guestbook_entries"
      ],
      "syncStrategy": "Last-Write-Wins (LWW) with ISO-8601 timestamps and atomic batch upserts"
    }
  },
  "imagekit": {
    "publicKey": "public_vie7nQLXXCidvyqXsEkC9qnkwWk=",
    "urlEndpoint": "https://ik.imagekit.io/9abzbu5ke/",
    "privateKey": "private_AkMqVfKakzjM/zJqxz5wM3x+hrs=",
    "configured": true,
    "uploadFolder": "/wedding-invitations",
    "cdnOptimization": "Global Tier-1 CDN with automatic WebP/AVIF transformation, progressive JPEG loading, lossless compression, and signed client upload authentication"
  },
  "r2": {
    "accountId": "9426f4fce849e75ba9560f855a882cb0",
    "accessKeyId": "65e6cb7bc4db4e0b5f13426e680a6d09",
    "secretAccessKey": "810a48b598b9e67d2644265df54b15da3806f156d11ffaa1c69cf720f78cae08",
    "bucketName": "wedding-videos",
    "publicUrl": "https://pub-9426f4fce849e75ba9560f855a882cb0.r2.dev",
    "configured": true,
    "uploadFolder": "guestbook-videos",
    "deliveryType": "Cloudflare Global Edge Anycast with zero egress fees, S3 compatibility, presigned ticket uploads, and direct video streaming"
  }
};

