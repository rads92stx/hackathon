# Hackathon Project

## Overview

This project is a backend service for a hackathon event. It is built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

# Project documentation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rads92stx/hackathon
   cd hackathon
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

### Running the Application

#### Using Docker

1. Build and start the containers:

   ```sh
   ./cli.sh up
   ```

2. The API will be available at `http://localhost:3000`.

#### Without Docker

1. Build the project:

   ```sh
   pnpm run build
   ```

2. Start the application:

   ```sh
   pnpm run start
   ```

3. The API will be available at `http://localhost:3000`.

### Contributing
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch).
Open a pull request.
### License
This project is licensed under the UNLICENSED License.
