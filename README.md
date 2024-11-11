<div align="center">

  <h1>Pairs</h1>
  
  <p>
    An interactive card game for the web.
  </p>

<h4>
    <a href="https://pairs-card-game.vercel.app">View Project</a>
</div>

<br />

<!-- About the Project -->

## Motivation

When I decided to learn Programming, Python was the first langauge I picked up. Python is a great language, however, building dynamic and interactive applications with a graphical user interface that is easily accessible in Python can prove challenging. Pairs started out initially as a terminal-based game built in Python. However, who wants to play a game in the terminal?

I wanted to make the application interative with a graphical user interface that was easy to use and could be shared easily on the web. This is how I fell into JavaScript and web development. Pairs has been through many iterations, UI/UX design changes, refactoring code for performance, optimizations and best practices, adding new features. I continue to work on the project with these implementations to test new programming and web development concepts.

The tech stack has changed over these iterations too, from a pure Python application to React => React + TypeScript + SASS => SolidJS + TypeScript + SASS. A server application was also implemented for the multiplayer feature, which uses the Socket.IO library to enable real-time, bi-directional communication between web clients and servers, a prominent feature for online multiplayer games. The server application currently uses [Deno](https://deno.com/).

<!-- TechStack -->

## Tech Stack (Current)

### [Client](https://github.com/Excelsior2021/pairs)

- [SolidJS](https://www.solidjs.com)
- [SASS](https://sass-lang.com)
- [TypeScript](https://www.typescriptlang.org)

### Server

- [TypeScript](https://www.typescriptlang.org)
- [Socket.IO](https://socket.io)

## Approach

The approach for the server was to support a multiplayer mode, where two players could play against each other in real-time. The server should also be able to handle multiple connections. Socket.IO was used to make this possible.

The server would also initialize and manage the game's state between two players (sockets). The paradigm of the server is more functional leaning due to the fact that data has to been sent between the clients and the server and the references to the objects holding state on both the clients and server would be lost in these instances.

TypeScript was implemented for static typing and Deno's built-in test runner was used for unit testing.

## Deployment

The backend for Pairs is currently deployed on [Deno Deploy](https://deno.com/deploy).

## Enhancements

This project can be enhanced with the following features:

- General improvements
