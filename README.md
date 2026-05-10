# Voyagr

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Voyagr** is a single-page web application built with React 19 and TypeScript that lets users browse a curated catalog of travel tours fetched from a remote API. Each tour is presented as a card displaying a high-quality destination image, the tour name, the price per person, and a collapsible description. The description starts in a shortened preview mode showing only the first sentence; users can expand it to read the full text by clicking **Read More**, and collapse it again with **Read Less**.

If a user decides a tour does not interest them, they can dismiss it by clicking the **Not Interested** button on that card. The tour is immediately removed from the list without any page reload. When all tours have been dismissed, the app transitions to an empty state showing a **Refresh** button that re-fetches the full catalog from the API, restoring the list from scratch.

The data flow is straightforward: on mount, the page calls a service layer (`tourService.getAll`) that hits the `/react-tours-project` endpoint, parses the JSON response, and populates the tour list. A loading indicator is displayed while the request is in flight. All state — the list of tours and the loading flag — lives in the top-level page component (`ToursPage`) and is passed down to each `CardTour` component as props.

The project is fully covered by a unit and integration test suite (Jest + Testing Library) with a minimum 70% coverage threshold across branches, functions, lines, and statements. Code quality is enforced through ESLint, Prettier, and a Husky pre-commit hook that runs lint-staged on every commit.

## Technologies used

To deliver the experience described above, the project is built on the following technologies:

1. React JS
2. TypeScript
3. Vite
4. HTML5
5. CSS3

## Libraries used

On top of those technologies, the project relies on the following dependencies declared in `package.json`:

#### Dependencies

```
"react": "^19.2.4"
"react-dom": "^19.2.4"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/react": "^19.2.14"
"@types/react-dom": "^19.2.3"
"@vitejs/plugin-react": "^5.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-react-hooks": "^5.0.0"
"eslint-plugin-react-refresh": "^0.4.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"vite": "^7.1.6"
```

## Getting Started

With the stack and libraries in place, set up the project locally as follows:

1. Clone the repository
2. Navigate to the project folder
3. Copy `.env.example` to `.env` (the dev server reads `VITE_API_URL` from this file to proxy `/react-tours-project` to the remote API)
4. Execute: `npm install`
5. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`.

## Testing

Once the app runs locally, you can validate behavior with the test suite (Jest + Testing Library, 70% coverage threshold across branches, functions, lines, and statements):

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security Audit

Beyond functional tests, the project ships with tooling to inspect dependencies and overall project health.

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

### React Doctor

Run a health check on the project (security, performance, dead code, architecture):

```bash
npm run doctor
```

Use `--verbose` to see specific files and line numbers:

```bash
npm run doctor -- --verbose
```

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/voyagr`](https://www.diegolibonati.com.ar/#/project/voyagr)
