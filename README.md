# The Backend

A RESTful API built with **Express.js**, **MongoDB**, and **ImageKit** for creating and fetching posts with image uploads.

📖 **[Full Documentation →](./backend/README.md)** — detailed code walkthrough, API reference, and beginner guides.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env    # Fill in your MongoDB URI and ImageKit key
npm run dev
```

## API

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/create-post` | Upload image + caption |
| GET    | `/post`        | Fetch all posts        |

## License

[ISC](LICENSE)
