This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (for production) or SQLite (for development)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd poll-app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables. Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://{username}:{password}@localhost:5432/polldb
```

4. Generate the Prisma client.

```bash
make prisma-generate
```

5. Migrate the development database.

```bash
make upgrade-db
```

6. Run the development server

```bash
make serve
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

The application will automatically create a guest user ID for you on your first visit. You can start creating and voting on polls immediately.

## API Endpoints

The application provides the following REST API endpoints:

### Polls

- **POST `/api/polls`** - Create a new poll with options

  - Returns voting and admin links for the created poll
  - Requires question, userId, and options in the request body

- **GET `/api/polls/[pollId]`** - Fetch a poll with its options and votes

  - Returns complete poll data including options and vote counts

- **PATCH `/api/polls/[pollId]`** - Update poll options
  - Handles creating, updating, and deleting options in a single transaction
  - Requires admin token for authentication
  - Preserves option order specified in the request

### Poll Options

- **POST `/api/polls/[pollId]/options`** - Add a new option to an existing poll
  - Primarily for voters to add options when allowVotersToAddOptions is enabled

### Votes

- **GET `/api/users/[userId]/votes/[pollId]`** - Fetch all votes for a user on a specific poll

  - Used to determine which options a user has already voted for

- **POST `/api/votes`** - Submit a vote for a poll option

  - Handles vote creation including user identification

- **DELETE `/api/votes/[voteId]`** - Remove a vote (unvote)
  - Used when a user clicks an option they previously voted for

## Frontend Structure

### Component Organization

The application's frontend is organized into a modular component structure:

- **Poll Components** (`src/components/poll/`)

  - **Create** - Components for creating new polls, handling question input and option management
  - **Vote** - Components for voting interface, displaying results and handling vote submission
  - **Shared** - Reusable components like DragDropOptions and PollOptionItem used across poll features

- **UI Components** (`src/components/ui/`)

  - Collection of reusable UI components from [shadcn/ui](https://ui.shadcn.com/)
  - Built with Tailwind CSS and Radix UI primitives
  - Customized and extended for application-specific needs
  - Includes specialized components like ValidationMessage for form handling

- **Layout Components** (`src/components/layout/`)

  - Page layouts and structural components
  - Includes BackgroundWrapper for animated visual effects

- **Theme Components** (`src/components/theme/`)
  - Theme selection and management components

### Pages

The application follows Next.js App Router structure:

- **Home Page** (`src/app/page.tsx`) - Landing page with options to create polls
- **Poll Detail Page** (`src/app/polls/[pollId]/page.tsx`) - Displays poll details and voting interface

## Authentication System

The application uses a simple yet effective authentication system:

- **Guest Authentication** - Users are automatically assigned a guest ID on their first visit

  - Implemented through Next.js middleware to ensure ID exists before page rendering
  - User IDs are stored in cookies with a 30-day expiration

- **Auth Context** - React context provides authentication state across the application

  - Exposes `userId`, `login`, and `logout` functions to components
  - Components can access current user with the `useAuth()` hook

- **Persistent Sessions** - Authentication persists between visits through cookies
  - No login/password required for basic functionality
  - Simple approach focused on tracking poll creation and voting
