# EventHub - Event Organizer Web Application

A full-featured event management platform built with Next.js, MongoDB, and modern web technologies. Create, manage, and discover amazing events with ease.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based registration and login
- **Event Management**: Full CRUD operations for events
- **Event Discovery**: Public event listing with advanced filtering
- **Dashboard**: Comprehensive event management interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Event Features
- **Rich Event Details**: Name, date, location, description, category, and images
- **Image Upload**: Base64 image storage (easily extensible to cloud storage)
- **Categories**: Organized event categorization
- **Search & Filter**: Advanced filtering by category, date, and search terms
- **Event Status**: Automatic upcoming/past event detection

### User Experience
- **Intuitive Interface**: Clean, modern design with shadcn/ui components
- **Real-time Updates**: Dynamic content updates
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant interface elements

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Atlas cloud hosting
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- Git

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/koustavx08/event-organizer.git
cd event-organizer
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Environment Setup
Create a \`.env.local\` file in the root directory:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventhub?retryWrites=true&w=majority
MONGODB_DB=eventhub

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
\`\`\`

### 4. MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and update \`MONGODB_URI\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
\`\`\`

### Events Collection
\`\`\`javascript
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
\`\`\`

## 🔐 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login

### Events
- \`GET /api/events\` - Get all events (public)
- \`POST /api/events\` - Create event (authenticated)
- \`GET /api/events/my-events\` - Get user's events (authenticated)
- \`GET /api/events/[id]\` - Get single event (public)
- \`PUT /api/events/[id]\` - Update event (authenticated, owner only)
- \`DELETE /api/events/[id]\` - Delete event (authenticated, owner only)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Image Upload
Currently using base64 encoding for images. To use cloud storage:

1. **Cloudinary Integration**:
\`\`\`javascript
// Add to .env.local
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
\`\`\`

2. **AWS S3 Integration**:
\`\`\`javascript
// Add to .env.local
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
\`\`\`

### Email Notifications
Add email service integration:
\`\`\`javascript
// Add to .env.local
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
\`\`\`

## 🧪 Testing

### Run Tests
\`\`\`bash
npm run test
# or
yarn test
\`\`\`

### Test Coverage
\`\`\`bash
npm run test:coverage
# or
yarn test:coverage
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/koustavx08/event-organizer/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/eventhub)

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Event CRUD operations
- [x] Event discovery and filtering
- [x] Responsive design

### Phase 2 (Upcoming)
- [ ] Event registration system
- [ ] Email notifications
- [ ] Event analytics
- [ ] Social sharing
- [ ] Event comments and reviews

### Phase 3 (Future)
- [ ] Payment integration
- [ ] Event ticketing
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [MongoDB](https://www.mongodb.com/) for the flexible database
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Lucide](https://lucide.dev/) for the icon library

---

**Built with ❤️ by the EventHub Team**

For more information, visit our [website](https://eventhub.example.com).
