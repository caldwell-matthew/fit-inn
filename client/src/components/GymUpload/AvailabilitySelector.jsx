import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Button from '@mui/material/Button';

const AvailabilitySelector = (props) => {
    const [avail,setAvail] = useState([]);
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState([]);
    const [value, setValue] = React.useState(dayjs('2022-11-03'));
    const [startingHours, setStartingHours] = useState(0);
    const [endingHours, setEndingHours] = useState(23);

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const handleDays = (event, newDays) => {
        setDays(newDays);
    };

    const setA = () => {
        let d = new Date(value);
        setTimes([]);
        setAvail([]);

        for (let i=0; i<(endingHours.$H-startingHours.$H+1); i++) {
            times.push(startingHours.$H+i);
        }

        for (let i=0; i<4; i++) {
            for (let j=0; j<days.length; j++) {
                d.setDate(d.getDate() + (days[j] + 7 - d.getDay()) % 7);
                for (let k=0; k<=times.length; k++) {
                    if (k===0) d.setHours(times[0]-1)
                    else {
                        d.setHours(d.getHours() + 1);
                        avail.push(d.toJSON());
                    }
                }
                if (days.length===1) d.setDate(d.getDate() + 7);
            }
        }
        props.setAvailability(avail);
    }
 
    return (
        <>
        <Stack spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
            label="Starting Day"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        <ToggleButtonGroup
            value={days}
            onChange={handleDays}
            aria-label="text formatting"
        >
            <ToggleButton value={0} aria-label="bold">
                Sunday
            </ToggleButton>
            <ToggleButton value={1} aria-label="bold">
                Monday
            </ToggleButton>
            <ToggleButton value={2} aria-label="bold">
                Tuesday
            </ToggleButton>
            <ToggleButton value={3} aria-label="bold">
                Wednesday
            </ToggleButton>
            <ToggleButton value={4} aria-label="bold">
                Thursday
            </ToggleButton>
            <ToggleButton value={5} aria-label="bold">
                Friday
            </ToggleButton>
            <ToggleButton value={6} aria-label="bold">
                Saturday
            </ToggleButton>
        </ToggleButtonGroup>
        </Stack>
        <Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label="Basic example"
                value={startingHours}
                onChange={(newValue) => {
                setStartingHours(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
                label="Basic example"
                value={endingHours}
                onChange={(newValue) => {
                setEndingHours(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        <Button variant="contained" onClick={() => setA()}>set avail</Button>
        </Stack>
        </>
    );
};
export default AvailabilitySelector;