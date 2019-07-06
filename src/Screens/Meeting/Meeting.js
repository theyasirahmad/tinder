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
      index:null

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

    // var imagesarray = imagesarray;

    // if (imagesarray.length < 3){

    // }

    return (
      <div className="App" >
        <div className="imagescontainer">
          <div className="swipeimagestag">
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                {/* <li data-slide-to="0" className={imageIndex === 0 && "active"}></li>
                <li data-slide-to="1" className={imageIndex === 1 && "active"}></li>
                <li data-slide-to="2" className={imageIndex === 2 && "active"} ></li> */}
                {imagesarray.map((item, index) => {
                  return (

                    <li key={index + "007"} data-slide-to={index} className={(imageIndex === index)? "active" : "  "}></li>
                  )
                })}

              </ol>

              <img src={imagesarray[imageIndex]} alt="Los Angeles" style={{ width: "100%", height: "85vh" }} />

              <li className="left carousel-control"  onClick={(e) => { e.preventDefault(); this.imageIndexCounter("dec") }} data-slide="prev">
                <span className="glyphicon glyphicon-chevron-left"></span>
                <span className="sr-only">Previous</span>
              </li>
              <li className="right carousel-control"  onClick={(e) => { e.preventDefault(); this.imageIndexCounter("inc") }} data-slide="next">
                <span className="glyphicon glyphicon-chevron-right"></span>
                <span className="sr-only">Next</span>
              </li>
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

  action = (swipe, selectedUser,index) => {

    if (swipe === "swipe left") {
      console.log("swipe left")
    }
    if (swipe === "swipe right") {

      swal("Do you Really want to meet " + selectedUser.name)
        .then((value) => {
          if (value) {
            this.setState({
              selectedUser: selectedUser,
              index
            })
          }
        });
    }
    if (swipe === "end") {
      swal("Thats all users matching your description")
        .then(() => {
          this.props.setUsersToNull()
          this.setState({
            userListEnd: true
          })
        })
    }
  }

  selectedUserToNull=(index)=>{
    this.setState({
      selectedUser:null,
      index:index
    })
  }
  cardsRender() {

    // eslint-disable-next-line 
    var height = screen.height;
    // eslint-disable-next-line 
    var width = screen.width;

    // height = (width>=height) ? "100vh" : height;
    height = "100vh";

    // const { imageurl1, imageurl2, imageurl3, imageurl4 } = this.state;
    // var imagesarray = [imageurl1, imageurl2, imageurl3, imageurl4]
    // var imagesarray = [];
    const users = this.props.users;


    return (
      <Cards  onEnd={()=>{this.action('end')}} size={[width, height]} cardSize={[width, height]} className='master-root'>
        {users.map((user, index) =>
          <Card key={index+ "11"}
            onSwipeLeft={() => { this.action("swipe left") }}
            onSwipeRight={() => { this.action("swipe right", user,index) }}>
            {
              this.profileRender(user.imagesUrl, user.name, user.nickname)
            }
          </Card>
        )}
      </Cards>
    )

  }

  render() {
    const { selectedUser ,index } = this.state;
    return (
      <div className='master-root1'>
        {!selectedUser && this.cardsRender()}
        {selectedUser && <MeetingPlace selectedUserToNull={this.selectedUserToNull} index={index} currentuser={this.props.currentuser} selectedUser={selectedUser} />}
      </div>
    );
  }
}

export default Meeting;
