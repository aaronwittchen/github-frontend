# GitHub Analytics Dashboard

A modern, interactive dashboard for exploring GitHub user and repository statistics. Built with **Vue 3**, **TypeScript**, and **Tailwind CSS**, this application provides a clean interface to visualize GitHub profiles, repositories, and contribution metrics.

---

## Features

### User Profile

* **Profile Overview**: Displays avatar, bio, location, company, and website.
* **Contribution Graph**: Interactive calendar heatmap of user contributions.
* **Language Statistics**: Breakdown of programming languages across repositories.
* **Top Repositories**: Highlights the user's most popular repositories with key metrics.

### Repository Explorer

* **Repository Search**: Search repositories by GitHub username.
* **Random Repository Discovery**: Explore random repositories with optional star-based filtering.
* **Repository Details**: View comprehensive repository information, including:

  * Stars, forks, and open issues
  * Primary programming language
  * Creation and last update dates
  * README content with syntax highlighting
  * Language distribution

### Interactive UI Components

* **Terminal-style Interface**: Command-line inspired interface for user interaction.
* **Responsive Design**: Works seamlessly on all devices.
* **Dark Theme**: Eye-friendly dark color scheme.
* **Loading States & Error Handling**: Clear feedback during data fetching and user-friendly error messages.

---

## Technical Stack

### Core Technologies

* **Vue 3** – Progressive JavaScript framework
* **TypeScript** – Type-safe JavaScript development
* **Tailwind CSS** – Utility-first CSS framework
* **Axios** – Promise-based HTTP client
* **Chart.js** – Interactive charts and graphs
* **Marked + Highlight.js** – Markdown rendering with syntax highlighting

### Development Tools

* **Vue CLI** – Project scaffolding and build tools
* **ESLint + Prettier** – Code linting and formatting
* **PostCSS** – CSS processing

---

## Getting Started

### Prerequisites

* Node.js (v14+)
* npm or yarn
* Backend API server (GitHub Analytics API)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/github-analytics-frontend.git
cd github-analytics-frontend

# Install dependencies
yarn install
# or
npm install
```

### Configuration

Create a `.env` file in the project root:

```
VUE_APP_API_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server
yarn serve
# or
npm run serve
```

Access the app at [http://localhost:8080](http://localhost:8080).

### Production Build

```bash
# Build for production
yarn build
# or
npm run build
```

The production-ready files will be in the `dist/` directory.

---

## API Integration

The frontend communicates with a backend API that interfaces with the GitHub API.

**Endpoints used:**

* `GET /v1/users/:username/summary` – Get user profile and statistics
* `GET /v1/repos/:owner/:repo` – Get repository details
* `GET /v1/repos/:owner/:repo/readme` – Get repository README
* `GET /v1/repositories/random` – Get a random repository

**Data Flow:**

1. User enters a GitHub username.
2. Application fetches user data from the API.
3. User profile and repository data are displayed in components.
4. Users can explore repository details and READMEs.
5. Random repository feature enables discovery of new projects.

---

## Testing

```bash
# Run unit tests
yarn test:unit

# Run end-to-end tests
yarn test:e2e

# Run all tests
yarn test
```
