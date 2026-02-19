# CineScope — Movie Browser Web App

This is a modern movie browsing web application built with **React**, **React Router**, and the **OMDB (Open Movie Database) API**.

It features:

- Modern dark UI with a hero slider and horizontal scrolling rows
- Dynamic search bar powered by OMDB
- Dedicated movie details page with posters, ratings, overview, and backdrops

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Create an OMDB API key**

- Sign up at [OMDB](https://www.omdbapi.com/apikey.aspx)
- Request a free or paid API key and wait for activation

3. **Configure environment variables**

- Create a `.env` file in the project root
- Copy the content from `.env.example` and paste your API key:

```bash
REACT_APP_OMDB_API_KEY=YOUR_OMDB_API_KEY_HERE
```

4. **Run the development server**

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Main Technologies

- React 18 with functional components and hooks
- React Router v6 for page routing
- Axios for API requests
- CSS Modules for scoped, Netflix-like styling

