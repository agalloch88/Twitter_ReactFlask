import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import HeartImage from "../images/Heart.png";
import Retweet from "../images/Retweet.png";
import Comment from "../images/Comment.png";
import Share from "../images/Share.png";
import Settings from "../images/Settings.png";
import BlueCheck from "../images/BlueCheck.png";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactTimeAgo from "react-time-ago";
// import ReplyModal from "./ReplyModal";

function TwitterCard({ tweet, profile }) {
  TimeAgo.addDefaultLocale(en);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Card
        id={tweet.id}
        style={{ width: "35rem", margin: "35px", cursor: "pointer" }}
        className="shadow-lg p-3 mb-5 bg-white rounded"
      >
        <Card.Body>
          <img
            alt="Profile"
            style={{ borderRadius: "50%" }}
            src={profile.profile_image_url}
          ></img>
          <img
            alt="setting"
            variant="top"
            src={Settings}
            style={{ marginLeft: "450px" }}
          />
          <Card.Title style={{ fontSize: "15px", fontWeight: "bolder" }}>
            {profile.name}{" "}
            {profile.verified ? (
              <img alt="blue check" variant="top" src={BlueCheck} />
            ) : null}
            <p style={{ fontSize: "15px", color: "gray" }}>
              @{profile.username}
            </p>
          </Card.Title>
          <Card.Text>{tweet.text}</Card.Text>
          <Card.Text>
            <ReactTimeAgo
              date={tweet.created_at}
              locale="en-US"
              timeStyle="twitter"
            />
          </Card.Text>
          <div
            className="twitterIcons"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <p>
              <img alt="comment" variant="top" src={Comment} /> {tweet.comments}
            </p>
            <p>
              <img
                alt="retweet"
                variant="top"
                src={Retweet}
                onClick={handleShow}
              />
              {setShow && (
                  <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>{profile.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{tweet.text}</Modal.Body>
                  <Modal.Body>Tweet ID: {tweet.id}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
              {" "}
              {tweet.retweet_count}
            </p>
            <p>
              <img alt="heart" variant="top" src={HeartImage} />{" "}
              {tweet.favorite_count}
            </p>
            <p>
              <img alt="share" variant="top" src={Share} />
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TwitterCard;
