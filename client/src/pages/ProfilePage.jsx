// import React, { Component, Fragment } from "react";
// import { Switch, Route } from 'react-router-dom';
//  import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
//  import 'react-pro-sidebar/dist/css/styles.css';
// import ProfileButtons from "../components/ProfilePage/ProfileButtons";
// import BasicInfo from "../components/ProfilePage/BasicInfo";
// import UserListings from "../components/ProfilePage/UserListings";
// import UserReservations from "../components/ProfilePage/UserReservations";
// import UserPayment from "../components/ProfilePage/UserPayment";
// import EditProfileInfo from "../components/ProfilePage/EditProfileInfo";
// import './ProfilePage.css'



// const ProfilePage = () => {

//     return (
//           <div>
//                 <div>
//                <ProfileButtons />
//                 </div>
//                <Switch>
//                     <Route path="/Profile/Basic">
//                         <BasicInfo />
//                     </Route>
//                     <Route path="/Profile/Listings">
//                         <UserListings />
//                     </Route>
//                     <Route path="/Profile/Reservations">
//                         <UserReservations />
//                     </Route>
//                     <Route path="/Profile/Payment">
//                         <UserPayment />
//                 </Route>
//                 <Route path="/Profile/Edit">
//                     <EditProfileInfo />
//                     </Route>

//                </Switch>
//           </div>
//     );
// }
// export default ProfilePage;

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicInfo from "../components/ProfilePage/BasicInfo";
import UserListings from "../components/ProfilePage/UserListings";
import UserReservations from "../components/ProfilePage/UserReservations";
import UserPayment from "../components/ProfilePage/UserPayment";
import EditProfileInfo from "../components/ProfilePage/EditProfileInfo";
import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
    query userQuery {
        get_User(id: "018054b3-f513-06be-ba11-5726fa2b1052") {
            address
            email
            favoriteGymIds
            fname
            lname
            notificationSetting
            password
            paymentMethod
            phoneNumber
            profilePicture
        }
    }
`;

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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const { error, data, loading } = useQuery(GET_USER);
  
  if(error) console.log(error);

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
          <Tab label="User Payment" {...a11yProps(3)} />
          <Tab label="Edit Profile" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <div>
      <TabPanel value={value} index={0}>
        <BasicInfo data={data} loading={loading}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserListings />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserReservations />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UserPayment />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <EditProfileInfo data={data} loading={loading}/>
      </TabPanel>
      </div>
    </Box>
  );
}
