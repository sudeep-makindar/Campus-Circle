# Campus Circle

A sleek, retro-themed micro-onboarding site for VIT Chennai freshmen to easily join their official branch community WhatsApp groups. Built with React and Vite.

## Tech Stack
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 4 + custom CSS for retro/arcade aesthetics
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)

### Setup & Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Dev Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or another port if 3000 is occupied).

## Environment Variables
This project requires no sensitive environment variables for the frontend to function, but standard Vite variables can be set:
- `VITE_API_URL` (if an API is added later)

## Build & Deployment
To build for production:
```bash
npm run build
```
This generates optimized static files in the `dist/` directory.

### Vercel Deployment
This project is configured perfectly for Vercel. 
1. Connect your GitHub repository to Vercel.
2. Ensure the Framework Preset is set to **Vite**.
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

## Project Structure
- `src/components/` - React UI components (Cards, Modals, Header)
- `src/data.ts` - Centralized JSON-like data for branch links and details
- `src/types.ts` - TypeScript interfaces
- `src/index.css` - Global styles, fonts, and custom retro scrollbar
- `public/` - Static assets (images)

## License
MIT License
