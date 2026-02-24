//import React from 'react';
import React, { useEffect, useState } from 'react';
import { setUrlByName } from '../../utils/Common';
import { setUserSession, removeUserSession } from '../../utils/Common';
import axios from 'axios';
import { getUser } from '../../utils/Common';


const Footer = () => {
    return (
        <footer className="py-3 bg-light mt-auto main-footer">
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">Copyright &copy; C&S Solution.</div>
                    <div>
                            {/* <a id = "plant" href="#!"  onClick={handleRederect} style={{fontSize:"11px"}}>{((localStorage.getItem('displayCompanyName')) != "null") ? localStorage.getItem('displayCompanyName') : "Your Are Currently In Polonnaruwa Transfer to Girithale"}</a> */}
                     </div>
                    <div>
                        <a href="#!">Privacy Policy</a> 
                        &middot;
                        <a href="#!">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const handleRederect =() =>{
    console.log(document.getElementById("plant").textContent);
    let text = document.getElementById("plant").textContent;
    let plant = "Girithale";
    let displayCompanyName = "Your Are Currently In Polonnaruwa Transfer to Girithale";
    if(text == "Your Are Currently In Polonnaruwa Transfer to Girithale"){
        plant ="Polonnaruwa";
        displayCompanyName = "Your Are Currently In Girithale Transfer to Polonnaruwa";
    }

    var url = setUrlByName(plant);
    var common_user = getUser();
    Login(url,common_user,displayCompanyName);

    //document.getElementById("plant").textContent
   // window.location.reload();
  }

  async function Login(url,user,displayCompanyName){
    axios({
        method: 'post',
        url: url+"/login",
        data: {
            email: user.email,
            password: "",
            common_user:user.common_user,
            
        }
    })
    .then(response => {
        
            console.log("************response.data**********");
            console.log(response.data);
            const data = response.data.user;
            const user = {
              id: data.id,
              name: data.name,
              email: data.email,
              common_user:data.common_user,
            }
            console.log("************user**********");
            console.log(user);
            setUserSession(response.data.access_token, user,url,displayCompanyName);
            window.location.reload();
        });
    }



export default Footer;