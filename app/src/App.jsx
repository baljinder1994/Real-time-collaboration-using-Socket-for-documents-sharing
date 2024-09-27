import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {io} from 'socket.io-client'

const socket=io('http://localhost:5000')

const App = () => {
  const[editorHtml,setEditHtml]=useState('')
  const[room,setRoom]=useState('')
  const[shareLink,setShareLink]=useState('')

  useEffect(() =>{
    socket.on('documentChange',(data) =>{
      console.log('Recieved update:', data)
      setEditHtml(data)
    })

    return() =>{
      socket.off('documentChange')
    }
  },[])

  useEffect(() =>{
    console.log('Editor content updated:', editorHtml)
  },[editorHtml])

  const handleChnage=(html) =>{
   setEditHtml(html)
   if(room){
    socket.emit('documentChange',{room,data:html})
    console.log('Room:',room)
    
   }
  }
  const handleRoom=()=>{
  if(room){
    socket.emit('joinRoom',room)
    setShareLink(`http://localhost:5173/?room=${room}`);
    console.log(`Joined Room: ${room}`)
  }
  }
  return (
    
    <div>
      <h2>Real Time Collabortaion</h2>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}></input>
      <button onClick={handleRoom}>Share</button>
      {shareLink && (
         <p>Share Link:<a href={shareLink}></a>{shareLink}</p>
    )}
      <ReactQuill
      modules={App.modules}
      formats={App.formats}
      value={editorHtml}
      onChange={handleChnage}
      />
    </div>
  )
}

App.modules={
  toolbar:[
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']   
  ]
}

App.formats=[
  'header','font','size','bold','italic','color','background','image'
]

export default App
