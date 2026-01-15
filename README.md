# Resource Rolodex Generator

A no-code tool that transforms CSV data into beautiful, mobile-first Shiny applications for organizing and sharing resources.

## 🎯 About

The Resource Rolodex Generator empowers clinicians, educators, and community organizations to create professional mobile apps without writing a single line of code. Simply upload your CSV data, configure your app's appearance, and download a fully functional Shiny application ready for deployment.

**Try it live at: [https://rolodexgenerator.cliniciansfirst.org](https://rolodexgenerator.cliniciansfirst.org/)**

## ✨ Features

- **No-Code Interface**: Build complete Shiny apps through an intuitive 5-step wizard
- **CSV-Powered**: Transform any CSV/TSV file into an interactive mobile app
- **Mobile-First Design**: Built with shinyMobile for native-like mobile experiences
- **Customizable Theming**: Choose from 6 pre-built color templates or create your own
- **Rich Content Support**: Add accordion sections, embedded videos, and custom welcome screens
- **Resource Categories**: Organize resources by type with automatic filtering
- **Contact Integration**: Include addresses, phone numbers (click-to-call), websites, and hours
- **PWA-Ready**: Generated apps can be installed on home screens like native apps
- **Docker Support**: Includes Dockerfile and deployment instructions
- **Complete Documentation**: Step-by-step guides with video tutorials included

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
   git clone https://github.com/ewokozwok/rolodex-generator.git
   cd rolodex-generator
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the development server**
```bash
   npm run dev
```

4. **Build for production**
```bash
   npm run build
```

> **Note**: This repository contains only the frontend generator interface. The generated Shiny apps are standalone and do not require this generator to run.

## 📖 Usage

### Step 1: Upload Data
- Prepare a CSV or TSV file with your resource data
- Download the example CSV template to see the required format
- Upload your file to begin

### Step 2: Map Fields
- Map your CSV columns to app fields:
  - **Resource Name**: Main heading for each resource
  - **Category**: For filtering and grouping resources
  - **Description**: Detailed information about the resource
  - **Address**: Physical location (optional)
  - **Phone**: Click-to-call phone numbers (optional)
  - **Website**: URLs to resource websites (optional)
  - **Hours**: Operating hours (optional)

### Step 3: Customize Home Screen
- Set your app title
- Create accordion sections for your welcome screen
- Add headers, text content, and embedded YouTube videos
- Configure 1-5 accordion items to introduce your app

### Step 4: Style Your App
- Choose from 6 professionally designed color templates:
  - Ocean Blue
  - Forest Green
  - Sunset
  - Midnight
  - Rose Garden
  - Slate Modern
- Or customize colors manually (Primary, Secondary, Accent, Text)
- Toggle search functionality

### Step 5: Generate & Download
- Download a complete ZIP package containing:
  - `app.R` - Your generated Shiny application
  - `Dockerfile.txt` - For containerized deployment
  - `Docker Build.txt` - Build instructions
  - `embed-app.txt` - Instructions for embedding in websites
  - `IMPORTANT - README.html` - Complete setup guide with videos
  - `www/` folder - All assets, icons, and service workers for PWA functionality

## 📱 Generated App Features

Your generated Shiny app includes:

- **Two-Tab Interface**: 
  - Home tab with customizable welcome content
  - Resources tab with category filtering
- **Progressive Web App (PWA)**: 
  - Installable on iOS and Android devices
  - Offline capability via service workers
  - App icons and manifest
- **Mobile-Optimized UI**:
  - Responsive design
  - Touch-friendly controls
  - Native-like animations
- **Resource Management**:
  - Category-based filtering
  - Expandable accordion items
  - Integrated contact options (call, visit, web)

## 🛠️ Technology Stack

- **Frontend Generator**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **File Handling**: JSZip, FileSaver.js
- **Generated Apps**: R, Shiny, shinyMobile

## 📊 CSV Format

Your CSV should include these columns (all optional except Name and Type):
```csv
Name,Type,Info,Address,Phone,Website,Hours
Resource Name,Category,Description,123 Main St,tel:555-0100,https://example.com,Mon-Fri 9-5
```

**Notes**:
- Phone numbers should use `tel:` prefix for click-to-call functionality
- Categories will appear as filter options in the app
- All fields except Name and Type are optional

## 🚢 Deployment Options

Generated apps can be deployed via:

1. **Local Deployment**: Run directly in RStudio
2. **Docker**: Use included Dockerfile for containerized deployment
3. **shinyapps.io**: Deploy to Posit's hosting platform
4. **Self-Hosted**: Deploy on your own Shiny Server

Complete instructions are included in the downloaded package.

## 🎨 Color Templates

Pre-built themes for instant professional styling:

- **Ocean Blue**: Modern, trustworthy blues and purples
- **Forest Green**: Calming, natural greens
- **Sunset**: Warm oranges and reds
- **Midnight**: Professional dark slate tones
- **Rose Garden**: Vibrant pinks and reds
- **Slate Modern**: Neutral grays with blue accents

## 🤝 Contributing

Contributions are welcome! Please reach out via email before submitting pull requests to discuss proposed changes.

## 📄 License

This project is licensed under the Apache License 2.0.

## 👨‍💻 Author

Created by **Evan E. Ozmat** and the **CliniciansFirst** team

## 📧 Contact

For questions, feedback, or deployment assistance:
- **Email**: contact@cliniciansfirst.org
- **Website**: [https://cliniciansfirst.org](https://cliniciansfirst.org)

## 💼 Professional Deployment Services

Need help deploying your app? CliniciansFirst offers:
- Expert deployment assistance
- Custom feature development
- Hosting solutions
- Technical support

**We're clinicians who code—we understand your workflow.**

Visit [cliniciansfirst.org/rolodex](https://cliniciansfirst.org/rolodex) for more information.

---

**Free to use** — Sponsored by CliniciansFirst