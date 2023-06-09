import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
//sa amboxj canki hamar
// export const loader = async () => {

//   return json({
//     jokeListItems: await db.joke.findMany(),
//   });
// };

//sa 5 hatn e erevum
export const loader = async ({ request }: LoaderArgs) => {
  const jokeListItems = await db.joke.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
  const user = await getUser(request);

  return json({
    jokeListItems,
    user,
  });
};
export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <div className="my-links">
            
              <Link to="new" className="button">
                Add your own
              </Link>
              <Link to="rss-joke.rss" reloadDocument className="button">
                View as RSS
              </Link>
            </div>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
