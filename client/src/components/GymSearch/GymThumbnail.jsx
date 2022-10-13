import React from "react";
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

const GymThumbnail = (props) => {
    if (props.loading) return "Loading...";
    else return ( <div> 
        <Grid container 
            direction="row"
            spacing={{ xs: 2, md: 3 }} 
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-between"
            alignItems="flex-start"
        >
            {props.gymData.list_GymItems._GymItems.map((val) => (
            <Grid item xs={"flexGrow"} key={val}><Item>
                <Typography variant="h3">
                    {val.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {' ' + val.address.street1} 
                    {val.address.street2 === '' ? ' ' + val.address.street2 : ''}
                    {' ' + val.address.City}
                    {' ' + val.address.State}
                    {' ' + val.address.zipcode}
                </Typography>
                <Typography variant="body1">
                    Description: {val.description}<br/>
                    Hourly Rate: ${val.cost}/hour<br/>
                </Typography>
                <Rating name="gym-rating" value={val.rating} size="medium" readOnly />
            </Item></Grid>
            ))}
        </Grid> 
    </div> );
}
export default GymThumbnail;


/*
Gym Name: {title}<br/>
Description: {description}<br/>
Max Number of Guests Allowed: {numGuestsAllowed}<br/>
Access Instructions: {accessInformation}<br/>
Address: {street1} {city} {state} {zip}<br/>
Gym Owner At Home: {isHostHome === "false" ? "No" : "Yes"}<br/>

--Equipment--
{GetEquip()}

--Amenities--
    Wifi: {hasWifi === "false" ? "No" : "Yes"}<br/>
    Bathrooms: {hasBathroom === "false" ? "No" : "Yes"}<br/>
    Speakers: {hasSpeakers === "false" ? "No" : "Yes"}<br/>
    TV Type: {tvType}<br/>

--Pricing and Availability--
    Hourly Rate: ${cost}/hour<br/>
    Starting Availability: AddStartDateTimeHere<br/>
    Ending Availability: AddEndDateTimeHere<br/>
    Booking Notice: {bookingNotice} hours<br/>
    Cancelation Notice: {cancelationWarning} hours<br/>
*/