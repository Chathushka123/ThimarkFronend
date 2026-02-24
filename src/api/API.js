import axios from 'axios';
import { getToken } from '../utils/Common';
import { getUrl } from '../utils/Common';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();

export default axios.create({
  baseURL: `${process.env.REACT_APP_DB_API_URL}`
 // baseURL: getUrl()
});