import React, {
    Component
} from 'react';
import './Profile.css';
import firebase from './../../Config/firebase';
import swal from 'sweetalert';
import Maps from './../Maps/Maps';
import { connect } from 'react-redux'
import { updateUser, removeUser } from '../../Redux/actions/authActions'


// const provider = new firebase.auth.FacebookAuthProvider();

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            next: false,
            nickname: "",
            phonenumber: "",
            image1: null,
            image2: null,
            image3: null,
            image1src: ".//upload.png",
            image2src: "https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_960_720.png",
            image3src: "https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_960_720.png",
            imagesUrl: [],
            progressPercent: "",
            beverages: false,
            coffee: false,
            cocktail: false,
            juice: true,
            duration1: false,
            duration2: false,
            duration3: false,
            coords: "",
            alldone: false,
            counter: 0

        }
        this.nicknameFunc = this.nicknameFunc.bind(this)
        this.phonenumberFunc = this.phonenumberFunc.bind(this)
        this.nextFunc = this.nextFunc.bind(this)

    }
    fileSelectedHandler = (index, event) => {

        console.log(index)
        // this.setState({
        //     image1: event.target.files[0]

        // })

        var currentImage = event.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onloadend = () => {

            switch (index) {
                case 1:
                    this.setState({
                        image1src: reader.result,
                        image1: currentImage
                    })
                    break;
                case 2:
                    this.setState({
                        image2src: reader.result,
                        image2: currentImage
                    })
                    break;
                case 3:
                    this.setState({
                        image3src: reader.result,
                        image3: currentImage
                    })
                    break;
                default:
                    swal("some thing went wrong")

            }
        }
    }

    static getDerivedStateFromProps(props, state) {

        const counter  = state.counter;
        if (props.user !== undefined && counter === 0) {
            // alert(props.user.name)
            return {
                nickname: props.user.name,
                phonenumber: props.user.phonenumber,
                image1src: props.user.imagesUrl[0],
                image2src: props.user.imagesUrl[1],
                image3src: props.user.imagesUrl[2],
                imagesUrl: [],
                // progressPercent: "",
                image1: true,
                image2: true,
                image3: true,
                coffee: props.user.coffee,
                cocktail: props.user.cocktail,
                juice: props.user.juice,
                duration1: props.user.duration1,
                duration2: props.user.duration2,
                duration3: props.user.duration3,
                counter:1,
            }
        }
        return {}
    }
    fileUploadhandler = () => {
        var uploadTask;
        // const currentuser = this.props.currentuser;
        const { image1, image2, image3, imagesUrl, progressPercent } = this.state;
        // console.log(currentuser.uid);

        if (image1) {

            var uploadimagesarray = [image1, image2, image3];

            for (var i = 0; i < 3; i++) {

                var filePath = firebase.auth().currentUser.uid + '/' + uploadimagesarray[i].name;
                uploadTask = firebase.storage().ref(filePath).put(uploadimagesarray[i])
                uploadTask.on('state_changed', (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progressPercent)
                    console.log('Upload is ' + progress + '% done');
                    // progress bar is not 100% okay
                    switch (snapshot.state) {

                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            // console.log(snapshot.state)
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');

                            // console.log(snapshot.state)
                            break;
                        case firebase.storage.TaskState.SUCCESS:
                            console.log("uploaded")
                            break;
                        default:
                            swal("some thing went wrong")

                    }
                }).bind(this)
                uploadTask.then((fileSnapshot) => {
                    fileSnapshot.ref.getDownloadURL()
                        .then((url) => {
                            imagesUrl.push(url)
                            console.log(imagesUrl)
                            if (imagesUrl.length <= 3) {
                                // swal("Click on either the button or outside the modal.")
                                //     .then((value) => {
                                //     console.log(this)
                                //     console.log(value)

                                //     });
                                swal("Upload completed!")
                                    .then((value) => {
                                        this.setState({ beverages: true })
                                        console.log(this)
                                    });

                            }
                        })
                });
            }
        }
        else {
            swal("Select 3 Images")
        }
    }
    nicknameFunc(e) {
        this.setState({
            nickname: e.target.value
        })
    }

    phonenumberFunc(e) {
        this.setState({
            phonenumber: e.target.value
        })
    }
    nextFunc() {
        const { next } = this.state;

        this.setState({
            next: (next) ? !next : !next
        })

        console.log(next);
    }
    SelectBev(index) {

        const { juice, coffee, cocktail } = this.state;
        switch (index) {
            case 1:
                this.setState({
                    coffee: (coffee) ? !coffee : !coffee,
                })
                break;
            case 2:
                this.setState({
                    juice: (juice) ? !juice : !juice,
                })
                break;
            case 3:
                this.setState({
                    cocktail: (cocktail) ? !cocktail : !cocktail,
                })
                break;
            default:
                swal("some thing went wrong")

        }
    }
    updateMeetingTime(i) {
        const { duration1, duration2, duration3 } = this.state;
        switch (i) {
            case 1:
                this.setState({
                    duration1: (duration1) ? !duration1 : !duration1,
                })
                break;
            case 2:
                this.setState({
                    duration2: (duration2) ? !duration2 : !duration2,
                })
                break;
            case 3:
                this.setState({
                    duration3: (duration3) ? !duration3 : !duration3,
                })
                break;
            default:
                swal("some thing went wrong")

        }
    }

    updateCoords = (e) => {
        this.setState({
            coords: e
        })
    }
    submitData() {


        const db = firebase.firestore();
        db.settings({ timestampsInSnapshots: true })

        const { coords, coffee, juice, cocktail, duration1, duration2, duration3, imagesUrl, phonenumber, nickname } = this.state;
        const currentuser = this.props.currentuser;

        var location = new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)

        db.collection("users")
            .doc(currentuser.uid)
            .set({ location: location, name: currentuser.displayName, nickname: nickname, phonenumber: phonenumber, coffee: coffee, juice: juice, cocktail: cocktail, duration1: duration1, duration2: duration2, duration3: duration3, imagesUrl: imagesUrl, uid: currentuser.uid })
            .then(() => {
                swal("Data Submitted Successfully")
                this.props.saveDataStatus();
            })

    }


    mapRender() {
        return (
            <div className="container-fluid">
                <h2 style={{ display: "block", margin: "0 auto", textAlign: "center" }}>Select your location</h2>
                <Maps updateCoords={this.updateCoords} />
                <button onClick={() => { this.submitData() }} className="btn btn-default" style={{ display: "block", margin: "2px auto", textAlign: "center", }}>Submit</button>
            </div>
        )
    }
    beveragesRender() {
        const { juice, coffee, cocktail, duration1, duration2, duration3 } = this.state;
        // var coffeeSrc = "https://thelondonpost.net/wp-content/uploads/2018/03/Americans-are-drinking-a-daily-cup-of-coffee.jpg"
        // var cocktailSrc = "https://img1.kochrezepte.at/use/8/green-mamba_8225.jpg";
        // var juiceSrc = "http://images.media-allrecipes.com/userphotos/960x960/3758394.jpg";

        var juiceSrc = "https://image.flaticon.com/icons/svg/77/77403.svg";
        var coffeeSrc = "http://getdrawings.com/img/silhouette-coffee-cup-14.jpg"
        var cocktailSrc = "https://cdn-images-1.medium.com/max/1200/1*c5cUtn-EnOz-NH9fxkrP2Q.png";


        var coffeeClass, juiceClass, cocktailClass;
        coffeeClass = (coffee) ? "pictures beveragesSelected" : "pictures beverages";
        juiceClass = (juice) ? "pictures beveragesSelected" : "pictures beverages";
        cocktailClass = (cocktail) ? "pictures beveragesSelected" : "pictures beverages";
        var emptyStarClass = "glyphicon glyphicon-star-empty";
        var filledStarClass = "glyphicon glyphicon-star starcolor"
        return (
            <div className="bevcontainer">
                <h1>Select beverages</h1>
                {<img onClick={() => this.SelectBev(1)} className={coffeeClass} src={coffeeSrc} alt="coffee" />}
                {<img onClick={() => this.SelectBev(2)} className={juiceClass} src={juiceSrc} alt="Juice" />}
                {<img onClick={() => this.SelectBev(3)} className={cocktailClass} src={cocktailSrc} alt="cocktail" />}
                {(juice || coffee || cocktail) &&
                    <div>
                        <ul>{<h3>Selected list</h3>}</ul>
                        {juice && <li >juice</li>}
                        {coffee && <li>coffee</li>}
                        {cocktail && <li>cocktail</li>}
                    </div>
                }
                {
                    <div className="meetingcontainer">
                        <ul>{<h2>duration of meeting</h2>}</ul>
                        <li onClick={() => this.updateMeetingTime(1)} ><span className={(duration1 && filledStarClass) || (emptyStarClass)}></span>20 mins</li>
                        <li onClick={() => this.updateMeetingTime(2)} ><span className={(duration2 && filledStarClass) || emptyStarClass}></span>60 min</li>
                        <li onClick={() => this.updateMeetingTime(3)} ><span className={(duration3 && filledStarClass) || emptyStarClass}></span>120 min</li>
                    </div>


                }
                {(juice || coffee || cocktail) && (duration1 || duration2 || duration3) &&
                    <div>
                        <button onClick={() => { this.setState({ alldone: true }) }} className="btn btn-default">Next</button>
                    </div>
                }
            </div>
        )
    }
    namenumberRender() {

        const user = this.props.currentuser;
        const { nickname, phonenumber } = this.state;

        return (
            <div className={"container"}>
                <h1>{user.displayName}</h1>
                <div className="form-group">
                    <label htmlFor="nickname">Enter Your nickname</label>
                    <input value={nickname} onChange={this.nicknameFunc} type="nickname" placeholder="Enter Your nickname" className="form-control" id="nickname" />
                </div>
                <div className="form-group">
                    <label htmlFor="phnumber">Phone no:</label>
                    <input value={phonenumber} onChange={this.phonenumberFunc} type="number" placeholder="Enter your Phone number" className="form-control" id="phnumber" />
                </div>
                <button onClick={this.nextFunc} className="btn btn-warning">Next</button>
            </div>
        )
    }
    uploadImagesRender() {
        const { image1src, image2src, image3src, progressPercent } = this.state;
        var text = "<= Back"
        return (
            <div className="container">
                <h2>Upload your photos</h2>
                <div className="form-group">
                    <input style={{ display: "none" }}
                        onChange={(e) => this.fileSelectedHandler(1, e)}
                        type="file" id="image1" accept="image/*"
                        ref={imageinput1 => this.imageinput1 = imageinput1}
                    />

                    <img className="pictures" title="Click to upload" onClick={() => this.imageinput1.click()} src={image1src} alt="img" />
                    <input style={{ display: "none" }}
                        onChange={(e) => this.fileSelectedHandler(2, e)}
                        type="file" id="image1" accept="image/*"
                        ref={imageinput2 => this.imageinput2 = imageinput2}
                    />
                    <img className="pictures" title="Click to upload" onClick={() => this.imageinput2.click()} src={image2src} alt="img" />
                    
                    
                    <input style={{ display: "none" }}
                        onChange={(e) => this.fileSelectedHandler(3, e)}
                        type="file" id="image1" accept="image/*"
                        ref={imageinput3 => this.imageinput3 = imageinput3}
                    />
                    <img className="pictures" title="Click to upload" onClick={() => this.imageinput3.click()} src={image3src} alt="img" />


                </div>{
                    progressPercent &&
                    <div className="progress">
                        <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50"
                            aria-valuemin="0" aria-valuemax="100" style={{ width: progressPercent }}>
                            {progressPercent} Complete
                 </div>
                    </div>
                }
                <button onClick={this.nextFunc} className="btn btn-default"> {text}</button>
                <button onClick={this.fileUploadhandler} className="btn btn-default" >Upload</button>
            </div>
        )
    }
    render() {
        const { next, beverages, alldone } = this.state;
        return (
            <div>
                {!alldone && !beverages && !next && this.namenumberRender()}
                {!alldone && !beverages && next && this.uploadImagesRender()}
                {!alldone && beverages && this.beveragesRender()}
                {alldone && this.mapRender()}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.authReducers.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (user) => dispatch(updateUser(user)),
        removeUser: () => dispatch(removeUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

// export default Profile;