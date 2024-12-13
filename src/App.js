import React, { useState } from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function App() {
  const [githubURL, setGitHubURL] = useState("");
  const [repoData, setRepoData] = useState([]);
  const [error, setError] = useState("");

  const handleURLSubmit = async () => {
    setError(""); // Clear previous errors
    setRepoData([]); // Clear previous repo data

    // Extract username from the GitHub URL
    const username = githubURL.split("github.com/")[1]?.split("/")[0];

    if (!username) {
      setError("Invalid GitHub URL. Please enter a valid URL.");
      return;
    }

    try {
      // Fetch repository data from GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Please check the username.");
      }

      const result = await response.json();
      if (result.length === 0) {
        setError("No repositories found for this user.");
      } else {
        setRepoData(result);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <Navbar className="navbar" expand="lg">
        <Container>
          <Navbar.Brand href="#" className="text-white">
            Code Essence
          </Navbar.Brand>
          <div>
            <Button variant="light" className="me-2">Account</Button>
            <Button variant="dark">Log Out</Button>
          </div>
        </Container>
      </Navbar>

      {/* GitHub URL Input Section */}
      <div className="mt-4">
        <Form>
          <Form.Group controlId="githubURL">
            <Form.Label className="fw-bold">Enter GitHub URL:</Form.Label>
            <Form.Control
              type="text"
              className="bg-light-pink mb-3"
              placeholder="Enter the GitHub profile URL"
              value={githubURL}
              onChange={(e) => setGitHubURL(e.target.value)}
            />
          </Form.Group>
          <Button variant="danger" onClick={handleURLSubmit}>
            Submit
          </Button>
        </Form>
      </div>

      {/* Error Message */}
      {error && <div className="mt-3 text-danger">{error}</div>}

      {/* Repository Data */}
      <div className="mt-4">
        {repoData.map((repo) => (
          <Card key={repo.id} className="mb-3">
            <Card.Body>
              <Card.Title>{repo.name}</Card.Title>
              <Card.Text>{repo.description || "No description available."}</Card.Text>
              <Button variant="primary" href={repo.html_url} target="_blank">
                View Repository
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
