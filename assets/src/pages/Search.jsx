import React from "react";
import TwitterCard from "../components/TwitterCard";
import UserInput from "../components/UserInput";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      tweets: [],
      profile: {id: "", name: "", profile_image_url: "", username: ""},
      tweetFinder: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUserNameSubmit = this.handleUserNameSubmit.bind(this);
    this.handleTweetSubmit = this.handleTweetSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleUserNameSubmit = (e) => {
    e.preventDefault();
    let currentValue = this.state.value.replace(" ", "");
    currentValue > "" ? 
      fetch(`/api/searchuser/${currentValue}/10`)
        .then((res) => res.json())
        .then((data) => this.setState({ tweets: [...data.data], profile: data.profile.data }))
        .catch((err) => console.log(err))
     : alert("Please enter a valid username")
     e.target.reset();
  };

  handleTweetSubmit = (e) => {
    e.preventDefault();
    let currentValue = this.state.value;
    currentValue > "" 
    ? fetch(`/api/searchtweet/${currentValue}`)
        .then((res) => res.json())
        .then((data) => this.setState({ tweetFinder: data.statuses }))
        .catch((err) => console.log(err))
    : 
      alert("Please enter a valid search")
      e.target.reset();
  };

  render() {
    const cardStyle = {
      display: "flex",
      flexWrap: "wrap",
      paddingTop: "80px",
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
    };
 

    const userTweets = this.state.tweets.map(tweet => (
      <TwitterCard key={tweet.id} tweet={tweet} profile={this.state.profile} />
    ))

    const finderTweets = this.state.tweetFinder.map(tweet => (
      <TwitterCard key={tweet.id} tweets={tweet} />
    ))

    return (
      <div className="search">
        <div style={cardStyle}>
          <div style={{ display: "flex" }}>
            <form onSubmit={this.handleUserNameSubmit}>
              <UserInput
                placeholder="Find User By Username"
                name="findUser"
                handleChange={this.handleChange}
                handleUserNameSubmit={this.handleUserNameSubmit}
              />
            </form>
            <br />
            <form onSubmit={this.handleTweetSubmit}>
              <UserInput
                placeholder="Find Tweet"
                name="findTweet"
                handleChange={this.handleChange}
              />
            </form>
          </div>
          {userTweets}
          {finderTweets}
        </div>
      </div>
    );
  }
}

export default Search;
