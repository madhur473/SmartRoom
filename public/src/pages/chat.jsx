import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allRoomsRoute, createRoomRoute, deleteRoomRoute, joinRoomRoute } from '../utils/APIRoute';
import Rooms from '../components/Rooms'
import Header from '../components/Header'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Icon from 'react-icons-kit';
import { xCircle } from 'react-icons-kit/feather';

function Chat() {
  const toastCss = {
    position: "top-right",
    theme: "dark",
    autoClose: 5000,
    pauseOnHover: true,
};
  const [createRoom, setCreateRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [displayCreate, setDisplayCreate] = useState('none');
  const [displayJoin, setDisplayJoin] = useState('none');
  const [transformCreate, setTransformCreate] = useState(0);
  const [transformJoin, setTransformJoin] = useState(0);
  const [displayDelete, setDisplayDelete] = useState('none');
  const [roomname, setRoomname] = useState(undefined);
  const [roomId, setRoomId] = useState(undefined);
  const changeHandler = (e) => {
    setCreateRoom(e.target.value);
  }
  const changeHandler2 = (e) => {
    setJoinRoom(e.target.value);
  }
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomIds, setRoomIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    defaultFunction();
    async function defaultFunction() {
      if (!localStorage.getItem('chat-user')) {
        navigate('/');
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-user")));
      }
      
    }
  }, []);
  const displaySettings = () => {
    if (displayCreate === 'none') {
      setDisplayCreate('flex')
      setTransformCreate(1)
    }
    else {
      setDisplayCreate('none')
      setTransformCreate(0)
    }
  }
  const displaySettings2 = ()=>{
    if (displayJoin === 'none') {
      setDisplayJoin('flex')
      setTransformCreate(1)
    }
    else {
      setDisplayJoin('none')
      setTransformCreate(0)
    }
  }
  useEffect(() => {
    defaultFunction();
    async function defaultFunction() {
      if (currentUser) {
        if (currentUser.isProfilePicSet) {
          const { data } = await axios.get(`${allRoomsRoute}/${currentUser._id}`);
          setRooms(data.data);
          setRoomIds(data.roomIds)
        }
        else {
          navigate("/setProfile")
        }
      }
    }
  }, [currentUser]);
  const sleep = (milliseconds)=>{
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const onCreate = async (e) => {
    e.preventDefault()
    if(createRoom === ""){
        toast.warning("Please enter Room name",toastCss)
    }
    else{
      const  { data } = await axios.post(`${createRoomRoute}/${currentUser._id}`, {
        roomName: createRoom
      });
      if(!data.status){
        toast.error(data.msg, toastCss)
      }
      else{
        toast.success(data.msg, toastCss);
        displaySettings();
        await sleep(5000)
        window.location.reload(true);
      }
    }
  }
  const displaySettings3 = (room, index)=>{
    setRoomname(room)
    setRoomId(roomIds[index])
    if (displayDelete === 'none') {
      setDisplayDelete('flex')
    }
    else {
      setDisplayDelete('none')
    }
  }
  const onDelete = async (e)=>{
    e.preventDefault();
    const {data} = await axios.post(`${deleteRoomRoute}/${currentUser._id}`,{roomName: roomname, roomId: roomId});
    if(!data.status){
      toast.error(data.msg, toastCss)
    }
    else{
      toast.success(data.msg, toastCss);
      displaySettings3();
      await sleep(5000)
      window.location.reload(true);
    }
  }
  const onJoin = async (e) => {
    e.preventDefault();
    const  {data} = await axios.post(`${joinRoomRoute}/${currentUser._id}`, {roomId: joinRoom});
    if(!data.status){
      toast.error(data.msg, toastCss);
    }
    else{
      toast.success(data.msg, toastCss);
      displaySettings2();
      await sleep(5000)
      window.location.reload(true);
    }
  }
  return (
    <>
    <ToastContainer />
      <FormContainer>
        <div className='displayCreate' style={{ display: `${displayCreate}`, transform: `${transformCreate}` }}>
          <div className="dialog-box"> 
          <span><Icon icon={xCircle} size={25} onClick={() => {
            if (displayCreate === 'none') { setDisplayCreate('flex') }
            else { setDisplayCreate('none') }
          }} style={{ color: "white", right: "32%",top: "18%", position: "fixed", cursor: "pointer"}} ></Icon></span>
            <h2>Create New Room</h2>
            <form onSubmit={(e) => { onCreate(e) }}>
              <input type="text" placeholder='Enter Name For Room' name='createRoom' value={createRoom} onChange={(event) => { changeHandler(event) }} />
              <button type='submit'>Create</button>
            </form>
          </div>
        </div>
        <div className='displayCreate' style={{ display: `${displayJoin}`, transform: `${transformJoin}` }}>
          <div className="dialog-box"> 
          <span><Icon icon={xCircle} size={25} onClick={() => {
            if (displayJoin === 'none') { setDisplayJoin('flex') }
            else { setDisplayJoin('none') }
          }} style={{ color: "white", right: "32%",top: "18%", position: "fixed", cursor: "pointer"}} ></Icon></span>
            <h2>Join Room</h2>
            <form onSubmit={(e) => { onJoin(e) }}>
              <input type="text" placeholder='Enter Room Id' name='joinRoom' value={joinRoom} onChange={(event) => { changeHandler2(event) }} />
              <button type='submit'>Join</button>
            </form>
          </div>
        </div>
        <div className='displayCreate' style={{ display: `${displayDelete}` }}>
          <div className="dialog-box"> 
          <span><Icon icon={xCircle} size={25} onClick={() => {
            if (displayDelete === 'none') { setDisplayDelete('flex') }
            else { setDisplayDelete('none') }
          }} style={{ color: "white", right: "32%",top: "18%", position: "fixed", cursor: "pointer"}} ></Icon></span>
            <h2>Do you Want to Delete This room</h2>
            <form onSubmit={(e) => { onDelete(e) }} className='deleteForm'> 
              <button type='submit' style={{backgroundColor: "Red", border: "2px solid red"}}>Yes</button>
              <button type='button' onClick={()=>{
            if (displayDelete === 'none') { setDisplayDelete('flex') }
            else { setDisplayDelete('none') }
            }}>No</button>
            </form>
          </div>
        </div>
      </FormContainer>
      
      <Header currentUser={currentUser} displaySettings={displaySettings} displaySettings2={displaySettings2}></Header>
      <Container>
        <div className="container">
          <Rooms rooms={rooms} currentUser={currentUser}  displaySettings3={displaySettings3}/>
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: #131325;
  .container{
    margin-top: 2rem;
    height: 80vh;
    width: 90%;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
  
`;
const FormContainer = styled.div`
.displayCreate{
  z-index: 99;
  transition: all 0.5ms ease-in-out;
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2a2a2a6b;
  justify-content: center;
  align-items: center;
  .dialog-box{
    justify-content: center;
    padding: 5rem 3rem;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border: none;
    border-radius: 1rem;
    background-color: black;
    h2{
      color: white;
    }
    form{
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: black;
    padding: 3rem 7rem;
    border-radius: 3rem;
    input{
        background: transparent;
        outline: none;
        width: 110%;
        border: 1px solid grey;
        border-bottom: 2px solid white;
        padding: 13px;
        border-radius: 5px;
        color: white;
        font-size: 20px;
        transition: 0.4s ease-in-out;
        &:focus{
            border: 1px solid blue;
            border-bottom: 2px solid blue;
        }
        &.visited{ 
            color: black;
            border: 1px solid grey;
            border-bottom: 2px solid white;
            background: white;
        }
    }
    button{
        background-color:white;
        color: black;
        padding: 10px;
        width: 120%;
        justify-content:center;
        align-items:center;
        border-radius: 5px;
        font-size: 20px;
        border: 2px solid white;
        outline: none;
        font-weight: bold;
        cursor: pointer;
        transition: 0.4s ease-in-out;
        &:hover{
            color: white;
            background-color: black;
        }
    }
  }
  .deleteForm{
    display: inline;
    width: 66%;
    padding: none;
    gap: 0px;
    border-radius: none;
    justify-content: space-between;
    align-items: flex-start;
    button{
        display: inline;
        background-color:white;
        color: black;
        padding: 10px;
        margin-inline-end: 25px;
        width: 40%;
        justify-content:center;
        align-items:center;
        border-radius: 5px;
        font-size: 20px;
        border: 2px solid white;
        outline: none;
        font-weight: bold;
        cursor: pointer;
        transition: 0.4s ease-in-out;
        &:hover{
            color: white;
            background-color: black;
        }
    }
  }
  }
} 

`;

export default Chat