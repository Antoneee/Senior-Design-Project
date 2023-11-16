import React, { useEffect, useRef, useState, useContext } from "react";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import SideNav from "../../sidenav/SideNav";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { AuthContext } from "../../../helpers/AuthContext";
import remoteViewingStyles from "./RemoteViewing.module.css";

const socket = io.connect("http://localhost:5000");

const RemoteViewing = () => {
  const { authState } = useContext(AuthContext);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: authState.name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  return (
    <div className={remoteViewingStyles["remote-viewing-page"]}>
      <SideNav remoteViewing={true} />
      <div className={remoteViewingStyles["content-container"]}>
        <Header />
        <div className={remoteViewingStyles["remote-viewing-container"]}>
          <h1 className={remoteViewingStyles["remote-viewing-heading"]}>
            Remote Viewing
          </h1>
          <div className={remoteViewingStyles["video-container"]}>
            <div className={remoteViewingStyles["video"]}>
              {stream && <video playsInline muted ref={myVideo} autoPlay />}
              <div className={remoteViewingStyles["video-user-container"]}>
                <p className={remoteViewingStyles["video-name"]}>
                  {authState.name}
                </p>
                <CopyToClipboard text={me}>
                  <button className={remoteViewingStyles["copy-id-btn"]}>
                    Copy ID
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className={remoteViewingStyles["video"]}>
              {callAccepted && !callEnded ? (
                <>
                  <video playsInline ref={userVideo} autoPlay />
                  <p className={remoteViewingStyles["video-name"]}>{name}</p>
                </>
              ) : null}
            </div>
          </div>
          <div className={remoteViewingStyles["call-container"]}>
            <input
              id="filled-basic"
              label="ID to call"
              type="text"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              className={remoteViewingStyles["call-input"]}
              placeholder="Enter the ID of the person you want to call..."
            />
            <div className={remoteViewingStyles["call-button"]}>
              {callAccepted && !callEnded ? (
                <button
                  className={`${remoteViewingStyles["call-btn"]} ${remoteViewingStyles["end-call-btn"]}`}
                  onClick={leaveCall}
                >
                  End Call
                </button>
              ) : (
                <button
                  className={`${remoteViewingStyles["call-btn"]} ${remoteViewingStyles["start-call-btn"]}`}
                  onClick={() => callUser(idToCall)}
                >
                  Start Call
                </button>
              )}
            </div>
          </div>
          <div>
            {receivingCall && !callAccepted ? (
              <div className={remoteViewingStyles["caller-msg-container"]}>
                <h1>{name} is calling...</h1>
                <button
                  className={`${remoteViewingStyles["call-btn"]} ${remoteViewingStyles["answer-call-btn"]}`}
                  onClick={answerCall}
                >
                  Answer
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RemoteViewing;
