# Moorberry.net

This project uses [Hugo](https://gohugo.io/), a fast and flexible static site generator. Follow the instructions below to install Hugo, get it running, and deploy your site.

## Prerequisites

- [Go](https://golang.org/doc/install) (Hugo is written in Go)
- Git

## Installation

1. **Install Hugo:**

  On macOS:
  ```sh
  brew install hugo
  ```

  On Windows:
  ```sh
  choco install hugo -confirm
  ```

  On Linux:
  ```sh
  sudo apt-get install hugo
  ```

2. **Verify the installation:**

  ```sh
  hugo version
  ```

## Getting Started

1. **Clone the repository:**

  ```sh
  git clone https://github.com/michaelminter/moorberry.net.git
  cd moorberry.net
  ```

2. **Run the Hugo server:**

  ```sh
  hugo server
  ```

  Open your browser and visit `http://localhost:1313` to see your site.

## Deployment

1. **Build the site:**

  ```sh
  hugo
  ```

  The generated files will be in the `public/` directory.

2. **Deploy to your web server:**

  Copy the contents of the `public/` directory to your web server's root directory.

  Example using rsync:
  ```sh
  rsync -avz public/ user@yourserver:/path/to/webroot
  ```

## Additional Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Themes](https://themes.gohugo.io/)

Feel free to contribute to this project by opening issues or submitting pull requests.

Happy building!
