import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { AiOutlineSetting } from "react-icons/ai";
import { CgList } from 'react-icons/cg';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ShowList from "./ShowList";
import EditEvent from "./EditEvent";

const EventManage = () => {
  const { myStorage } = useContext(AppContext);
  const currUser = myStorage.getItem("user");
  const user = JSON.parse(currUser);
  const params = useParams();

  const [event, setEvent] = useState({});

  const getEvent = async() => {
    const eventsKey = {
      param: params.param2,
      email: user.email,
    };
    await axios
      .post("http://localhost:8000/api/event/userevents-manage", eventsKey)
      .then((res) => {
        setEvent(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getEvent()
    // eslint-disable-next-line
  }, [user.email, params]);

  const [ editDetails, setEditDetails ] = useState(false)
  const [ showList, setShowList ] = useState(false)

  return (
    <div className="relative bg-manage-event bg-cover bg-center w-full h-screen flex items-center justify-center">
      <Link
        to={`/account/${user.id}`}
        className="absolute top-10 left-20 text-white text-5xl hover:text-red-500 cursor-pointer"
      >
        <IoMdArrowDropleftCircle />
      </Link>
      {event && (
        <div className="max-w-2xl m-auto bg-white/80 rounded-md overflow-hidden">
          {<img src={event.image} alt="event-pic" /> || <Skeleton/>}
          <div className="relative p-2">
            <h1 className="text-3xl underline text-center">{event.title}</h1>
            <p>Desc: {event.sub}</p>
            <p>Date: {event.date}</p>
            <p>Start: {event.time}</p>
            <p>At: {event.location}</p>
            <p>Price: {event.price === 0 ? "free" : `C$ ${event.price}`}</p>
            <p>
              Participants: {event.amount} / {event.participants}
            </p>
            <div className="absolute bottom-4 right-4 flex justify-center items-center gap-4 text-xl">
              <div className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setShowList(true)}>
                <CgList/>
              </div>
              <div className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setEditDetails(true)}>
                <AiOutlineSetting />
              </div>
            </div>
          </div>
        </div>
      )}
      {user && showList && (
        <ShowList setShowList={setShowList} event={event} user={user}/>
      )}
      {user && editDetails && (
        <EditEvent setEditDetails={setEditDetails} event={event} getEvent={getEvent}/>
      )}
    </div>
  );
};

export default EventManage;
