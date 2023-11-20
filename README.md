## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Before you begin ensure you have the following installed:

- **Node.js**
- **PostgreSQL**

## Installing

A step by step series of examples that tell you how to get environment running.

Clone the repository:

```
git clone [http or ssh URL]
```

Install NPM packages:

```
npm install
```

## Setting Up Environment Variables

Since .env.test and .env.development are not tracked by Git, you'll need to create these files manually to connect to the databases locally.

### Create a .env.test file:

This file should contain environment variables for your test environment.
Add the following line to the file:

```
PGDATABASE=nc_news_test
```

This sets the PostgreSQL database to nc_news_test for your test environment.

### Create a .env.development file:

This file should contain environment variables for your development environment.
Add the following line to the file:

```
PGDATABASE=nc_news
```

This sets the PostgreSQL database to nc_news for your development environment.
Ensure that these files are located in the root directory of your project.

## Running the Application

### To run the application in development mode, use:

```
npm run dev
```

### For running tests:

Run the tests:
```
npm test
```
