# Student Dashboard

## Overview

This project is a modern student learning dashboard built as part of the Frontend Intern Challenge. The goal was to create a responsive and visually engaging learning platform using Next.js, Supabase, Tailwind CSS, and Framer Motion.

The dashboard follows a Bento Grid layout and focuses on smooth interactions, clean design, and a responsive user experience across desktop, tablet, and mobile devices.

## Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Supabase
* Framer Motion
* Lucide React

## Features

* Responsive Bento Grid layout
* Animated sidebar navigation
* Dynamic course cards
* Course progress tracking
* Activity visualization section
* Loading states and error handling
* Smooth hover and entrance animations using Framer Motion
* Dark theme UI

## Data Handling

Course information is stored in a Supabase PostgreSQL database and fetched dynamically. This makes it easy to update course data without changing the frontend code.

## Component Structure

The application is divided into reusable components to keep the code organized and maintainable. Layout, navigation, course cards, and activity sections are separated into their own components.

## Server and Client Components

I used Next.js App Router to separate data fetching and UI interactions. Data is fetched from Supabase and passed into components, while interactive elements such as animations and user interactions are handled on the client side.

## Challenges Faced

One of the main challenges was integrating Supabase while maintaining a clean project structure. Another challenge was creating smooth animations without affecting responsiveness or layout stability. I also spent time refining the Bento Grid layout so that it adapts well across different screen sizes.

## Running the Project

Install dependencies:

npm install

Start the development server:

npm run dev

## Environment Variables

Create a `.env.local` file and add:

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
