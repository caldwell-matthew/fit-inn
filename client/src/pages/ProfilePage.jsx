import * as React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicInfo from "../components/ProfilePage/BasicInfo";
import UserListings from "../components/ProfilePage/UserListings";
import UserReservations from "../components/ProfilePage/UserReservations";
import EditProfileInfo from "../components/ProfilePage/EditProfileInfo";
import Axios from 'axios';
import Swal from 'sweetalert2';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = useState(0);
  const [userData, setUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userGymData, setUserGymData] = useState([]);
  const [userGymLoading, setUserGymLoading] = useState(true);
  const [profileUpdated, setProfileUpdated] = useState(0);

  useEffect(() => {
    Swal.showLoading();
    if (props.userId) {
      let str = process.env.REACT_APP_BACKEND_APP + '/api/getUser/' + props.userId
      try{
      Axios.get(str).then((response) => {
        setUserData(response.data);
        setUserLoading(false);
      })} catch (error) { console.log(error); alert("Error on Page");}
      str = process.env.REACT_APP_BACKEND_APP + '/api/getUserGyms/' + props.userId
      try{
      Axios.get(str).then((response) => {
        Swal.close();
        setUserGymData(response.data);
        console.log(userGymData)
        setUserGymLoading(false);
    })}catch (error) { console.log(error); alert("Error on Page");}}
  },[props,profileUpdated]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className='profile-page'>
      <Box className='profile-page-header'>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Basic Info" {...a11yProps(0)} />
          <Tab label="User Listings" {...a11yProps(1)} />
          <Tab label="User Reservations" {...a11yProps(2)} />
          <Tab label="Edit Profile" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <div>
      <TabPanel value={value} index={0}>
        <BasicInfo data={userData} loading={userLoading}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserListings data={userGymData} loading={userGymLoading} setValue={setValue} profileUpdated={profileUpdated} setProfileUpdated={setProfileUpdated}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserReservations userId = {props.userId} userGyms={userGymData} data={userGymData} setValue={setValue} profileUpdated={profileUpdated} setProfileUpdated={setProfileUpdated}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EditProfileInfo userId = {props.userId} data={userData} loading={userLoading} setValue={setValue} profileUpdated={profileUpdated} setProfileUpdated={setProfileUpdated}/>
      </TabPanel>
      </div>
    </Box>
  );
}

