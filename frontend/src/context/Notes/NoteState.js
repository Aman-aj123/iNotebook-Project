import React, { useEffect, useState } from "react"
import NoteContext from "./NoteContext";

// Packages 
import Swal from 'sweetalert2'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const NoteState = (props) => {


     // auth token
     const authToken = localStorage.getItem('token');

     const [notes, setNotes] = useState([]);


     // Fetching all notes
     const fetchAllNotes = async () => {
          const options = {
               method: "GET",
               headers: {
                    "auth-token": authToken,
                    "Content-Type": 'application/json'
               },
          };
          const URL = `${process.env.REACT_APP_API_BASE_URL}/api/notes/fetchAllNotes`
          try {
               const data = await fetch(URL, options);
               const response = await data.json();
               setNotes(response);
          } catch (error) {
               console.log(`Some error occurs while fetching All Notes.. with : ${error}`);
          }

     };

     // Calling fetchAllNotes in useEffect  
     useEffect(() => {
          fetchAllNotes();
     }, []);



     //-------> Add note 
     const addNotes = async (title, description, tags, noteid) => {
          // Add API call
          const options = {
               method: "POST",
               headers: {
                    "auth-token": authToken,
                    "Content-Type": 'application/json'
               },
               body: JSON.stringify({ title, description, tags })
          };

          try {
               const URL = `${process.env.REACT_APP_API_BASE_URL}/api/notes/addnote/`
               const data = await fetch(URL, options);
              

               toast.success("Your note has been added ... !", {
                    position: 'top-center',
                    autoClose: 800
               });

               setTimeout(() => {
                    window.location.reload();
               }, 1000);



          } catch (error) {
               console.log(`Some error occurs while adding the note with : ${error}`);
          }

     }



     //------>  Delete note 
     const deleteNote = async (noteid) => {
          const findedNote = notes.find((element) => element._id === noteid);
          const deletedNoteTitle = findedNote.title;

          // Showing 'sweat-alert' component
          const result = await Swal.fire({
               title: `Are you sure you want to delete "${findedNote.title}"?`,
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#d33',
               cancelButtonColor: '#3085d6',
               confirmButtonText: 'Yes, delete it!',
               width: '40%',
               customClass: {
                    container: 'custom-sweetalert-container',
                    title: 'text-xl',
               },

          });

          if (result.isConfirmed) {
               // Delete API call
               const options = {
                    method: "DELETE",
                    headers: {
                         "auth-token": authToken,
                         "Content-Type": 'application/json'
                    },
               };
               try {
                    const URL = `${process.env.REACT_APP_API_BASE_URL}/api/notes/deletenote/${noteid}`
                    const data = await fetch(URL, options);
                     
                    toast.error(` "${deletedNoteTitle}" has been deleted `, {
                         position: 'top-center',
                         autoClose: 800
                    });
                    setTimeout(() => {
                         window.location.reload();
                    }, 1000);


               } catch (error) {
                    console.log(`Some error occurs while deleting the note with: ${error}`)
               };

          } else {
               return;
          }

     };



     //------> Edit note
     const editNote = async (title, description, tags, noteid) => {
          // Edit API Call
          const options = {
               method: "PUT",
               headers: {
                    "auth-token": authToken,
                    "Content-Type": 'application/json'
               },
               body: JSON.stringify({ title, description, tags })
          };

          try {
               const URL = `${process.env.REACT_APP_API_BASE_URL}/api/notes/updatenote/${noteid}`
               const data = await fetch(URL, options);


             
               toast.success("Your note has been edited ... !", {
                    position: 'top-center',
                    autoClose: 800
               });
               setTimeout(() => {
                    window.location.reload();
               }, 1000);

          } catch (error) {
               console.log(`Some error occurs while editing the note with: ${error}`);
          }
     };


     return (
          <NoteContext.Provider value={{ notes, addNotes, deleteNote, editNote }}>
               {props.children}
               <ToastContainer />
          </NoteContext.Provider >
     );
};


export default NoteState;