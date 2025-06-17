import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kolkata-events"
const MONGODB_DB = process.env.MONGODB_DB || "kolkata-events"

// In production, you should use connection pooling
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Database initialization function
export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create indexes for better performance
  await createIndexes(db)

  // Seed initial data if needed
  await seedInitialData(db)
}

async function createIndexes(db: Db) {
  // Users collection indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ role: 1 })
  await db.collection("users").createIndex({ status: 1 })
  await db.collection("users").createIndex({ createdAt: -1 })

  // Events collection indexes
  await db.collection("events").createIndex({ organizer: 1 })
  await db.collection("events").createIndex({ date: 1 })
  await db.collection("events").createIndex({ category: 1 })
  await db.collection("events").createIndex({ "location.area": 1 })
  await db.collection("events").createIndex({ status: 1 })
  await db.collection("events").createIndex({ featured: 1 })
  await db.collection("events").createIndex({
    name: "text",
    description: "text",
    "location.venue": "text",
  })

  // RSVPs collection indexes
  await db.collection("rsvps").createIndex({ eventId: 1, userId: 1 }, { unique: true })
  await db.collection("rsvps").createIndex({ eventId: 1 })
  await db.collection("rsvps").createIndex({ userId: 1 })
  await db.collection("rsvps").createIndex({ qrCode: 1 }, { unique: true })
  await db.collection("rsvps").createIndex({ status: 1 })
  await db.collection("rsvps").createIndex({ checkedIn: 1 })

  // Categories collection indexes
  await db.collection("categories").createIndex({ name: 1 }, { unique: true })
  await db.collection("categories").createIndex({ active: 1 })

  // Areas collection indexes
  await db.collection("areas").createIndex({ name: 1 }, { unique: true })
  await db.collection("areas").createIndex({ active: 1 })

  console.log("Database indexes created successfully")
}

async function seedInitialData(db: Db) {
  // Seed Kolkata areas
  const areasCount = await db.collection("areas").countDocuments()
  if (areasCount === 0) {
    await db.collection("areas").insertMany([
      {
        name: "Park Street",
        active: true,
        description: "Heart of Kolkata's nightlife and dining",
        createdAt: new Date(),
      },
      { name: "Salt Lake", active: true, description: "Modern planned city area", createdAt: new Date() },
      { name: "New Town", active: true, description: "IT hub and modern residential area", createdAt: new Date() },
      {
        name: "Ballygunge",
        active: true,
        description: "Upscale residential and commercial area",
        createdAt: new Date(),
      },
      { name: "Alipore", active: true, description: "Historic and affluent neighborhood", createdAt: new Date() },
      { name: "Howrah", active: true, description: "Industrial and transport hub", createdAt: new Date() },
      { name: "Jadavpur", active: true, description: "Educational and cultural center", createdAt: new Date() },
      { name: "Gariahat", active: true, description: "Shopping and commercial district", createdAt: new Date() },
      { name: "Esplanade", active: true, description: "Central business district", createdAt: new Date() },
      { name: "Dumdum", active: true, description: "Airport area and residential zone", createdAt: new Date() },
    ])
  }

  // Seed event categories
  const categoriesCount = await db.collection("categories").countDocuments()
  if (categoriesCount === 0) {
    await db.collection("categories").insertMany([
      {
        name: "Cultural",
        active: true,
        description: "Bengali cultural events and festivals",
        icon: "🎭",
        createdAt: new Date(),
      },
      {
        name: "Music",
        active: true,
        description: "Concerts and musical performances",
        icon: "🎵",
        createdAt: new Date(),
      },
      {
        name: "Food",
        active: true,
        description: "Food festivals and culinary events",
        icon: "🍽️",
        createdAt: new Date(),
      },
      {
        name: "Technology",
        active: true,
        description: "Tech meetups and conferences",
        icon: "💻",
        createdAt: new Date(),
      },
      { name: "Sports", active: true, description: "Sports events and tournaments", icon: "⚽", createdAt: new Date() },
      {
        name: "Education",
        active: true,
        description: "Workshops and educational seminars",
        icon: "📚",
        createdAt: new Date(),
      },
      {
        name: "Business",
        active: true,
        description: "Business networking and conferences",
        icon: "💼",
        createdAt: new Date(),
      },
      {
        name: "Art",
        active: true,
        description: "Art exhibitions and creative events",
        icon: "🎨",
        createdAt: new Date(),
      },
      {
        name: "Festival",
        active: true,
        description: "Traditional and modern festivals",
        icon: "🎉",
        createdAt: new Date(),
      },
      {
        name: "Community",
        active: true,
        description: "Community gatherings and social events",
        icon: "👥",
        createdAt: new Date(),
      },
    ])
  }

  console.log("Initial data seeded successfully")
}
