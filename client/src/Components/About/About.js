import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="container">
      <small className="small">About</small>
      <h1 className="heading">Evangadi Networks Q&A</h1>
      <p className="paragraph">
        No matter what stage of life you are in, whether you’re just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.!
        Whether you are willing to share your knowledge or you are just looking
        to meet mentors of your own, please start by joining the network here.
      </p>
      <button className="button">
        <Link to="/register" className="link">
          How it works
        </Link>
      </button>
    </div>
  );
}

export default About;
