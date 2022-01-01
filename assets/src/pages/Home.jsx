import React from "react";
import { Card } from "react-bootstrap";
import HeartImage from "../images/Heart.png";
import Retweet from "../images/Retweet.png";
import Comment from "../images/Comment.png";
import BlueCheck from "../images/BlueCheck.png";
import Share from "../images/Share.png";
import Settings from "../images/Settings.png";
import CoverImage from "../images/Sun.jpg";

function Home() {
  const cardStyle = {
    display: "flex",
    paddingTop: "200px",
    justifyContent: "center",
  };
  return (
    <div className="home">
      <div style={cardStyle}>
        <div>
          <Card style={{ width: "35rem", margin: "35px" }}>
            <Card.Body>
              <div style={{ justifyContent: "flex-start" }}>
                <Card.Title style={{ fontSize: "15px", fontWeight: "bolder" }}>
                  Ryan Kirsch{" "}
                  <img alt="blue check" variant="top" src={BlueCheck} />{" "}
                  <img
                    alt="setting"
                    variant="top"
                    src={Settings}
                    style={{ marginLeft: "360px" }}
                  />
                  <p style={{ fontSize: "15px", color: "gray" }}>@RyanKirsch</p>
                </Card.Title>
              </div>
              <Card.Text style={{ fontSize: "15px" }}>
                Welcome to my Twitter display app! It's built with Flask and React. You can search for Twitter accounts via the Search page, or check out a Random result via the Random page. This interacts with v2 of the Twitter API. 
              </Card.Text>
              <Card.Img
                variant="top"
                src={CoverImage}
                style={{ borderRadius: "10%" }}
              />
              <div
                className="twitterIcons"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <p>
                  <img alt="comment" variant="top" src={Comment} /> 1.2K
                </p>
                <p>
                  <img alt="retweet" variant="top" src={Retweet} /> 5K
                </p>
                <p>
                  <img alt="heart" variant="top" src={HeartImage} /> 12.1K
                </p>
                <p>
                  <img alt="share" variant="top" src={Share} />
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
