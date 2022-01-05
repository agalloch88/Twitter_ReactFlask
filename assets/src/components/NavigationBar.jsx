import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  return (
    <nav className="navbar navbar-light bg-light navbar-expand-lg fixed-top">
      <a href="#twitter" className="navbar-brand font-weight-bolder">
        Twitter API Challenge
      </a>
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav ml-auto">
          <li className="navbar-item">
            <NavLink to="/" className="nav-link">
              Homepage
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/search" className="nav-link">
              Search
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;