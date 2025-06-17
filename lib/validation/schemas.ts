import * as yup from "yup"

// User validation schema
export const userSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  role: yup.string().oneOf(["admin", "organizer", "attendee"]).default("attendee"),
  status: yup.string().oneOf(["active", "blocked", "pending"]).default("active"),
  profile: yup
    .object({
      avatar: yup.string().url("Invalid avatar URL"),
      bio: yup.string().max(500, "Bio must be less than 500 characters"),
      phone: yup.string().matches(/^[+]?[\d\s-()]+$/, "Invalid phone number"),
      location: yup.string(),
      interests: yup.array().of(yup.string()),
    })
    .optional(),
  preferences: yup
    .object({
      emailNotifications: yup.boolean().default(true),
      smsNotifications: yup.boolean().default(false),
      eventReminders: yup.boolean().default(true),
      marketingEmails: yup.boolean().default(false),
    })
    .optional(),
})

// Event validation schema
export const eventSchema = yup.object({
  name: yup.string().required("Event name is required").min(3, "Event name must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  date: yup.date().required("Event date is required").min(new Date(), "Event date must be in the future"),
  endDate: yup.date().optional().min(yup.ref("date"), "End date must be after start date"),
  location: yup
    .object({
      venue: yup.string().required("Venue is required"),
      address: yup.string().required("Address is required"),
      area: yup.string().required("Area is required"),
      coordinates: yup
        .object({
          latitude: yup.number().min(-90).max(90),
          longitude: yup.number().min(-180).max(180),
        })
        .optional(),
      landmarks: yup.array().of(yup.string()).optional(),
    })
    .required(),
  category: yup.string().required("Category is required"),
  subcategory: yup.string().optional(),
  images: yup
    .object({
      main: yup.string().required("Main image is required"),
      gallery: yup.array().of(yup.string()).optional(),
    })
    .required(),
  pricing: yup
    .object({
      type: yup.string().oneOf(["free", "paid"]).required(),
      amount: yup.number().when("type", {
        is: "paid",
        then: (schema) => schema.required("Amount is required for paid events").min(0),
        otherwise: (schema) => schema.optional(),
      }),
      currency: yup.string().default("INR"),
      earlyBird: yup
        .object({
          amount: yup.number().required().min(0),
          deadline: yup.date().required().max(yup.ref("date")),
        })
        .optional(),
    })
    .required(),
  capacity: yup
    .object({
      total: yup.number().min(1, "Capacity must be at least 1"),
      available: yup.number().min(0),
    })
    .optional(),
  tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
  status: yup.string().oneOf(["draft", "published", "cancelled", "completed"]).default("draft"),
  featured: yup.boolean().default(false),
  requirements: yup
    .object({
      ageLimit: yup.number().min(0).max(100),
      prerequisites: yup.array().of(yup.string()),
      materials: yup.array().of(yup.string()),
    })
    .optional(),
  contact: yup
    .object({
      email: yup.string().required("Contact email is required").email(),
      phone: yup.string().matches(/^[+]?[\d\s-()]+$/, "Invalid phone number"),
      website: yup.string().url("Invalid website URL"),
    })
    .required(),
})

// RSVP validation schema
export const rsvpSchema = yup.object({
  eventId: yup.string().required("Event ID is required"),
  userName: yup.string().required("Name is required").min(2),
  userEmail: yup.string().required("Email is required").email(),
  userPhone: yup
    .string()
    .matches(/^[+]?[\d\s-()]+$/, "Invalid phone number")
    .optional(),
  ticketType: yup.string().optional(),
  specialRequests: yup.string().max(500, "Special requests must be less than 500 characters").optional(),
  dietaryRestrictions: yup.array().of(yup.string()).optional(),
  emergencyContact: yup
    .object({
      name: yup.string().required("Emergency contact name is required"),
      phone: yup
        .string()
        .required("Emergency contact phone is required")
        .matches(/^[+]?[\d\s-()]+$/),
      relationship: yup.string().required("Relationship is required"),
    })
    .optional(),
})

// Category validation schema
export const categorySchema = yup.object({
  name: yup.string().required("Category name is required").min(2),
  description: yup.string().required("Description is required"),
  icon: yup.string().required("Icon is required"),
  color: yup
    .string()
    .matches(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
  active: yup.boolean().default(true),
  parentCategory: yup.string().optional(),
})

// Area validation schema
export const areaSchema = yup.object({
  name: yup.string().required("Area name is required").min(2),
  description: yup.string().required("Description is required"),
  active: yup.boolean().default(true),
  coordinates: yup
    .object({
      latitude: yup.number().min(-90).max(90).required(),
      longitude: yup.number().min(-180).max(180).required(),
    })
    .optional(),
  landmarks: yup.array().of(yup.string()).default([]),
  popularVenues: yup.array().of(yup.string()).optional(),
  transportLinks: yup.array().of(yup.string()).optional(),
})
