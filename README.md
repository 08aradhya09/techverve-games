# 🚀 TechVerve Arcade: Where Skill Meets Play

TechVerve Arcade is an interactive, visually polished web platform for tech-inspired games and coding challenges written for teenagers.
Designed to blend learning and competition, it features multiplayer trivia, coding puzzles, meme generators, and a social tech community hub.
Leaderboards, custom avatars, achievement badges, and a lively UI encourage skill-building and playful collaboration—making tech fun, friendly, and accessible for everyone.

## ✨ Features

-   **User Authentication**: Secure login and registration powered by Supabase Auth.
-   **Game Library**: A collection of tech-themed games including puzzles, trivia, and arcade challenges.
-   **Leaderboards**: Track high scores and compete with other players.
-   **Achievement System**: Earn badges and points for in-game accomplishments.
-   **Community Hub**: Share scores, discuss games, and connect with other users.
-   **Custom Profiles**: Personalize your avatar and bio.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Supabase (PostgreSQL Database, Authentication, Row Level Security)
-   **Build Tool**: Vite

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   Node.js (v18 or later recommended)
-   A Supabase account ([sign up for free](https://supabase.com/))

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd techverve-games
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Supabase:**
    -   Create a new project on your [Supabase Dashboard](https://app.supabase.com).
    -   In your new project, navigate to the **SQL Editor**.
    -   Copy the entire contents of `supabase/migrations/20251014095914_create_techverve_arcade_schema.sql` and run it to set up your database tables, policies, and seed data.

4.  **Configure Environment Variables:**
    -   In the root of your project, create a file named `.env.local`.
    -   Go to **Project Settings > API** in your Supabase dashboard to find your credentials.
    -   Add your Supabase URL and `anon` key to the `.env.local` file:
        ```env
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open http://localhost:5173 (or the address shown in your terminal) to view the application.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please make sure your code is formatted and follows the project's coding standards.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
