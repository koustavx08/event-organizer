<div align="center">

# 🎉 Kolkata Events
### *Professional Event Management Platform*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*A modern, full-featured event management platform that brings Kolkata's vibrant event scene to your fingertips. Built with cutting-edge technology for seamless event creation, discovery, and management.*

[🚀 Live Demo](https://your-demo-url.vercel.app) • [📖 Documentation](#-quick-start) • [🐛 Report Bug](https://github.com/koustavx08/event-organizer/issues) • [✨ Request Feature](https://github.com/koustavx08/event-organizer/issues)

</div>

---

## ✨ Features

<details open>
<summary><b>🔐 Core Functionality</b></summary>

- 🔑 **User Authentication**: Secure JWT-based registration and login
- 📝 **Event Management**: Full CRUD operations for events
- 🔍 **Event Discovery**: Public event listing with advanced filtering
- 📊 **Dashboard**: Comprehensive event management interface
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

</details>

<details open>
<summary><b>🎪 Event Features</b></summary>

- 📋 **Rich Event Details**: Name, date, location, description, category, and images
- 🖼️ **Image Upload**: Base64 image storage (easily extensible to cloud storage)
- 🏷️ **Categories**: Organized event categorization
- 🔎 **Search & Filter**: Advanced filtering by category, date, area, and search terms
- ⏰ **Event Status**: Automatic upcoming/past event detection
- 🎫 **RSVP & QR Tickets**: RSVP to events and get QR code tickets
- 👑 **Admin Panel**: Manage users, events, and view stats

</details>

<details open>
<summary><b>🎨 User Experience</b></summary>

- 🎯 **Intuitive Interface**: Clean, modern design with shadcn/ui components
- ⚡ **Real-time Updates**: Dynamic content updates
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ♿ **Accessibility**: WCAG compliant interface elements

</details>

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend** 🎨
- ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js&logoColor=white) React framework with App Router
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) Type-safe development
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) Utility-first CSS framework
- ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white) High-quality UI components
- ![Lucide React](https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white) Beautiful icons

</td>
<td>

**Backend** ⚙️
- ![Next.js API](https://img.shields.io/badge/Next.js_API-000000?style=flat-square&logo=next.js&logoColor=white) Serverless API endpoints
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) NoSQL database with Atlas cloud hosting
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) Secure authentication tokens
- ![bcryptjs](https://img.shields.io/badge/bcryptjs-338AF3?style=flat-square&logo=npm&logoColor=white) Password hashing

</td>
</tr>
<tr>
<td colspan="2">

**Development** 🔧
- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) Code linting
- ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white) Code formatting
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) Static type checking

</td>
</tr>
</table>

## � Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/kolkata-events.git
cd kolkata-events
```

### 2. Install Dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kolkataevents?retryWrites=true&w=majority
MONGODB_DB=kolkataevents

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and update `MONGODB_URI`

### 5. Run the Development Server

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

<details>
<summary><b>📊 Users Collection</b></summary>

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

</details>

<details>
<summary><b>🎪 Events Collection</b></summary>

```javascript
{
  _id: ObjectId,
  name: String,
  date: Date,
  location: String,
  description: String,
  category: String,
  image: String (base64 or URL),
  organizer: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

</details>

## 🔐 API Endpoints

<details>
<summary><b>🔑 Authentication</b></summary>

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

</details>

<details>
<summary><b>🎉 Events</b></summary>

- `GET /api/events` - Get all events (public)
- `POST /api/events` - Create event (authenticated)
- `GET /api/events/my-events` - Get user's events (authenticated)
- `GET /api/events/[id]` - Get single event (public)
- `PUT /api/events/[id]` - Update event (authenticated, owner only)
- `DELETE /api/events/[id]` - Delete event (authenticated, owner only)

</details>

## 🚀 Deployment

### 🔥 Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### 🌐 Other Platforms

The application can be deployed on any platform that supports Next.js:

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployments
- **DigitalOcean App Platform** - Cloud hosting
- **AWS Amplify** - AWS managed hosting

## ⚙️ Configuration

### 🖼️ Image Upload

Currently using base64 encoding for images. To use cloud storage:

**1. Cloudinary Integration:**

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**2. AWS S3 Integration:**

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

### 📧 Email Notifications

Add email service integration:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 🧪 Testing

### Run Tests

```bash
pnpm test
# or
yarn test
# or
npm run test
```

### Test Coverage

```bash
pnpm test:coverage
# or
yarn test:coverage
# or
npm run test:coverage
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌟 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. 🔍 Check the [Issues](https://github.com/koustavx08/event-organizer/issues) page
2. 🐛 Create a new issue with detailed information

## 🗺️ Roadmap

### Phase 1 (Current) ✅

- [x] User authentication
- [x] Event CRUD operations
- [x] Event discovery and filtering
- [x] Responsive design

### Phase 2 (Upcoming) 🚧

- [ ] Event registration system
- [ ] Email notifications
- [ ] Event analytics
- [ ] Social sharing
- [ ] Event comments and reviews

### Phase 3 (Future) 🔮

- [ ] Payment integration
- [ ] Event ticketing
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- 🚀 [Next.js](https://nextjs.org/) for the amazing React framework
- 🍃 [MongoDB](https://www.mongodb.com/) for the flexible database
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- ✨ [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- 🎯 [Lucide](https://lucide.dev/) for the icon library

---

<div align="center">

### 💝 Built with ❤️ by [Koustav Singh](https://koustavx08.vercel.app)

**⭐ If you found this project helpful, please give it a star!**

[![GitHub stars](https://img.shields.io/github/stars/koustavx08/event-organizer?style=social)](https://github.com/koustavx08/event-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/koustavx08/event-organizer?style=social)](https://github.com/koustavx08/event-organizer/network/members)
[![GitHub issues](https://img.shields.io/github/issues/koustavx08/event-organizer)](https://github.com/koustavx08/event-organizer/issues)

*Made with 🎉 for the vibrant event community of Kolkata*

</div>
