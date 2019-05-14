import React, { Component } from 'react';
import './Meeting.css';
import Cards, { Card } from 'react-swipe-deck'
import swal from 'sweetalert';
import MeetingPlace from './../MeetingPlace/MeetingPlace';
class Meeting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageurl1: "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
      imageurl2: "https://www.gettyimages.in/gi-resources/images/Homepage/Hero/US/SEP2016/prestige-476863311.jpg",
      imageurl3: "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
      imageIndex: 0,
      selectedUser: null,


    }
  }

  imageIndexCounter = (e) => {
    var { imageIndex } = this.state;
    if (e === "inc") {
      this.setState({
        imageIndex: (imageIndex === 2) ? 0 : imageIndex + 1
      })
    }
    else {
      this.setState({
        imageIndex: (imageIndex === 0) ? 2 : imageIndex - 1
      })
    }

  }
  profileRender(imagesarray, FullName, Nickname) {
    const { imageIndex } = this.state;

    return (
      <div className="App" onSwipeLeft={this.imageIndexCounter}>
        <div className="imagescontainer">
          <div className="swipeimagestag">
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-slide-to="0" className={imageIndex === 0 && "active"}></li>
                <li data-slide-to="1" className={imageIndex === 1 && "active"}></li>
                <li data-slide-to="2" className={imageIndex === 2 && "active"} ></li>
              </ol>

              <img src={imagesarray[imageIndex]} alt="Los Angeles" style={{ width: "100%", height: "85vh" }} />

              <a className="left carousel-control" href onClick={(e) => {e.preventDefault(); this.imageIndexCounter("dec")}}  data-slide="prev">
                <span className="glyphicon glyphicon-chevron-left"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="right carousel-control" href onClick={(e) => {e.preventDefault(); this.imageIndexCounter("inc")}} data-slide="next">
                <span className="glyphicon glyphicon-chevron-right"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div className="nameUsername" style={{ height: "15vh" }}>
            <p className="fullname">{FullName}</p>
            <p className="nickname">{Nickname}</p>

          </div>

        </div>
      </div>
    );
  }

  action = (swipe, selectedUser) => {

    if (swipe === "swipe left") {
      console.log("swipe left")
    }
    if (swipe === "swipe right") {

      swal("Do you Really want to meet " + selectedUser.name)
        .then((value) => {
          if (value) {
            this.setState({
              selectedUser: selectedUser
            })
          }
        });
    }
    if (swipe === "end") {
      swal("Thats all users matching your description")
        .then(() => {
          this.setState({
            userListEnd: true
          })
        })
    }
  }

  cardsRender() {

    // eslint-disable-next-line 
    var height = screen.height;
    // eslint-disable-next-line 
    var width = screen.width;

    // height = (width>=height) ? "100vh" : height;
    height = "100vh";

    const { imageurl1, imageurl2, imageurl3, imageurl4 } = this.state;
    var imagesarray = [imageurl1, imageurl2, imageurl3, imageurl4]
    const users = this.props.users;


    return (
      <Cards size={[width, height]} cardSize={[width, height]} className='master-root'>
        {users.map((user, index) =>
          <Card key={index}
            onSwipeLeft={() => { this.action("swipe left") }}
            onSwipeRight={() => { this.action("swipe right", user) }}>
            {
              this.profileRender(imagesarray, user.name, user.nickname)
            }
          </Card>
        )}
      </Cards>
    )

  }

  render() {
    const { selectedUser } = this.state;
    return (
      <div className='master-root1'>
        {!selectedUser && this.cardsRender()}
        {selectedUser && <MeetingPlace currentuser={this.props.currentuser} selectedUser={selectedUser} />}
      </div>
    );
  }
}

export default Meeting;
