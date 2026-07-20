// return the user data from the session storage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem('token') || null;
}

// overwrite just the access token (used after a silent refresh-token renewal,
// so it doesn't wipe the selected company/plant like setUserSession would)
export const updateToken = (token) => {
  localStorage.setItem('token', token);
}

// read a cookie value by name (used to echo the csrf_refresh_token cookie
// back as the X-CSRF-TOKEN header on /refreshToken and /logout requests)
export const getCookie = (name) => {
  const row = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
  if (!row) return undefined;
  return row.split('=').slice(1).join('=');
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('company');
  localStorage.removeItem('displayCompanyName');
  localStorage.clear();
}

// set the token and user from the session storage
export const setUserSession = (token, user, url = null,displayCompanyName=null) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('company');
  localStorage.removeItem('displayCompanyName');
  localStorage.clear();
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('company', url);
  localStorage.setItem('displayCompanyName', displayCompanyName);
  
}

export const getUrl = () => {
  let company = localStorage.getItem('company');
  
  if(company == null || company=="null"){
   // company = "https://biamsfx.inqube.com//Polonnaruwa/backendpln/index.php/api/v1";
    company = "https://balpsfx.inqube.com//backend/index.php/api/v1";
   //company = "http://sfxbackend.test:8080//api/v1";
  }
  return company;
}
export const setUrl = (plant) =>{
  
  let plant_path = "";
  if(plant == 1){
   // plant_path = "https://biamsfx.inqube.com//Polonnaruwa/backendpln/index.php/api/v1";
    plant_path = "https://balpsfx.inqube.com//backend/index.php/api/v1";
  // plant_path = "http://sfxbackend.test:8080//api/v1";
  }else if(plant == 2){
   // plant_path = "https://biamsfx.inqube.com//Girithale/backendgirithale/index.php/api/v1";
    plant_path = "https://balgsfx.inqube.com//backend/index.php/api/v1";
 // plant_path = "http://cutingmodule.test:8080//api/v1";
  }

  //localStorage.setItem('company', plant_path);
  
  return plant_path;
  
}

export const setUrlByName = (plant) =>{
  
  let plant_path = "";
  if(plant == "Girithale"){
    //plant_path = "https://balpsfx.inqube.com//BALP/backend/index.php/api/v1";
   // plant_path = "https://biamsfx.inqube.com//Polonnaruwa/backendpln/index.php/api/v1";
    plant_path = "https://balpsfx.inqube.com//backend/index.php/api/v1";
  // plant_path = "http://sfxbackend.test:8080//api/v1";
  }else if(plant == "Polonnaruwa"){
  //  plant_path = "https://balpsfx.inqube.com//BALG/backend/index.php/api/v1";
 // plant_path = "https://biamsfx.inqube.com//Girithale/backendgirithale/index.php/api/v1";
  plant_path = "https://balgsfx.inqube.com//backend/index.php/api/v1";
 // plant_path = "http://cutingmodule.test:8080//api/v1";
  }

  //localStorage.setItem('company', plant_path);
  
  return plant_path;
  
}