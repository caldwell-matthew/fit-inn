import * as React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Axios from 'axios';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useHistory } from "react-router-dom";
import AWS from 'aws-sdk';
import AvailabilitySelector from './AvailabilitySelector';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';



const S3_BUCKET = "fit-inn";
const REGION = "us-west-1";
const ACCESS_KEY = "AKIAQOR3AGQZFTFG3X4B";
const SECRET_ACCESS_KEY = "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";

window.Buffer = window.Buffer || require("buffer").Buffer;


AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return ( <Typography
		component="div"
		role="tabpanel"
		hidden={value !== index}
		id={`action-tabpanel-${index}`}
		aria-labelledby={`action-tab-${index}`}
		{...other}>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</Typography>);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `action-tab-${index}`,
		'aria-controls': `action-tabpanel-${index}`,
	};
}

function Item(props) {return null;}
Item.propTypes = {children: PropTypes.node};

function UploadTab(props) {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => { setValue(newValue); };
	const handleChangeIndex = (index) => { setValue(index); };
	const history = useHistory();

    useEffect(() => {
		Swal.showLoading();
		let bestr = process.env.REACT_APP_BACKEND_APP + '/api/listEquipment';
		Axios.get(bestr).then((response) => {
		Swal.close();
		for (let i =0; i < response.data.list_EquipmentItems._EquipmentItems.length; i++) 
			equipMap.set(response.data.list_EquipmentItems._EquipmentItems[i]._id, response.data.list_EquipmentItems._EquipmentItems[i].name);
		setEquipmentMap(equipMap);
		return () => { setState({}); };
	})},[]);
	
	const redirectToGym = (gymId) => { 
		history.push('/ViewGym',{gymId: gymId, isActive: isActive}); 	
	}

	const SelectEquipment = () => {
        const [equip, setEquip] = useState('');
        const [equipDets, setEquipDets] = useState('');
        const equipmentObj = [];

		equipmentMap.forEach((value, key) => equipmentObj.push({key: key, value: value}));

        function setEquipmentInfo() {
            if(equip !== '') {
                setEquipment(prevState => [...prevState, equip]);
                setEquipmentDetails(prevState => [...prevState, equipDets]);
            }
            else alert('Please Select a Piece of Equipment');
        }

        return ( <>
			<FormControl sx={{ m: 1, minWidth: 200 }}>
				<InputLabel>Select Equipment</InputLabel>
				<Select
					id="Equipment" 
					label="Equipment"
					variant="outlined"
					value={equip}
					onChange={(e) => setEquip(e.target.value)}
				>
					{equipmentObj.map((val, index) => 
						<MenuItem key={index} value={val.key}>
							{val.value}
						</MenuItem>)}
				</Select>
			</FormControl>
			<FormControl sx={{ m: 1, minWidth: 50 }}>
				<TextField
					required
					id="equip-details"
					label="Equipment Details"
					variant="outlined"
					value={equipDets} 
					onChange={(e) => setEquipDets(e.target.value)}
					helperText={equipDets === "" ? 'Please enter equipment details.' : ' '}
				/>
				
			</FormControl>
			<FormControl sx={{ m: 1, minWidth: 50}}>
				<Button 
					variant="contained" 
					onClick={() => setEquipmentInfo()}
					size="large"
					style={{top: "12px"}}
				>
					Add
				</Button>
			</FormControl>
		

			<br></br>
		</>);
    }

    const SubmitGym = () => {
		
		Swal.showLoading();
		if (title === '') {
            Swal.close();
			alert('Please Set a Gym Name');
            return;
        }
        if (description === '') {
            Swal.close();
			alert('Please Set a Description');
            return;
        }
		if (numGuestsAllowed === '' || numGuestsAllowed <= 0 || isNaN(numGuestsAllowed)) {
            Swal.close();
			alert('Number of Guests must be greater than 0.');
            return;
        }
		if (accessInformation === '') {
            Swal.close();
			alert('Please Give Access Information');
            return;
        }
        if (street1 === '') {
            Swal.close();
			alert('Please Set a Street');
            return;
        }
        if (city === '' || !isNaN(city)) {
            Swal.close();
			alert('Please Set a City');
            return;
        }
        if (state === '' || !isNaN(state)) {
            Swal.close();
			alert('Please Set a State');
            return;
        }
        // if (zip === '' || isNaN(zip)) {
        //     alert('Please Set a Zip');
        //     return;
        // }
        if (equipment.length < 1) {
            Swal.close();
			alert('Please Select at Least One Piece of Equipment');
            return;
        }
		if (availability.length < 1) {
            Swal.close();
			alert('Please Select available Times');
            return;
        }
		if (cost <= 0 || cost > 100 || isNaN(cost)) {
			Swal.close();
			alert('Hourly rate must be a number from 1-100.');
            return;
		}
        
        const equipmentObj = [];
        for (let i = 0; i < equipment.length; i++) 
            equipmentObj.push({"details": equipmentDetails[i], "equipmentId": equipment[i]});

		const line2 = city + ", " + state;
		var isHostHomeB = false;
        var hasWifiB = false;
        var hasSpeakersB = false;
        var hasBathroomB = false;
        if (isHostHome === 'true') isHostHomeB = true;
        if (hasWifi === 'true') hasWifiB = true;
        if (hasSpeakers === 'true') hasSpeakersB = true;
        if (hasBathroom === 'true') hasBathroomB = true;
		var str = process.env.REACT_APP_BACKEND_APP + '/api/verifyAddress/' + street1 + '/' + line2;
		Axios.get(str).then(response => {
			Swal.close();
			if (response.data.ErrorCode === 0) {
				const fullZip = response.data.Zip + '-' + response.data.Zip4;
				const address = {"street1": response.data.AddressLine1, "stree2": "", 
				"City": response.data.City, "State": response.data.State, "Country": "United States", 
				"zipcode": fullZip};
				if(!props.gymId) { try {
					let bestr = process.env.REACT_APP_BACKEND_APP + '/api/uploadgym';
					Axios.post(bestr, {
				accessInformation: accessInformation, 
				address: address, 
				availability: availability, 
				bookingNotice: Number(bookingNotice), 
				cancelationWarning: Number(cancelationWarning), 
				cost: Number(cost), 
				description: description, 
				hasBathroom: hasBathroomB, 
				hasSpeakers: hasSpeakersB, 
				hasWifi: hasWifiB, 
				isHostHome: isHostHomeB, 
				numGuestsAllowed: Number(numGuestsAllowed), 
				ownerId: ownerId, 
				photos: photos, 
				startingDate: startingDate.toJSON(),
				startingHours: startingHours.toJSON(),
				endingHours: endingHours.toJSON(),
				days: days,
				title: title, 
				tvType: tvType, 
				equipment: equipmentObj})
				.then((response) =>
					redirectToGym(response.data)
				)
			} catch (error) { console.log(error); alert("Error on Page")}
		} else { 
			Swal.showLoading();
			try {
				let bestr = process.env.REACT_APP_BACKEND_APP + '/api/updateGym';
				Axios.post(bestr, {
				accessInformation: accessInformation, 
				address: address, 
				availability: availability, 
				bookingNotice: Number(bookingNotice), 
				cancelationWarning: Number(cancelationWarning), 
				cost: Number(cost), 
				description: description, 
				hasBathroom: hasBathroomB, 
				hasSpeakers: hasSpeakersB, 
				hasWifi: hasWifiB, 
				isHostHome: isHostHomeB, 
				numGuestsAllowed: Number(numGuestsAllowed), 
				ownerId: ownerId, 
				photos: photos, 
				startingDate: startingDate.toJSON(),
				startingHours: startingHours.toJSON(),
				endingHours: endingHours.toJSON(),
				days: days,
				title: title, 
				tvType: tvType, 
				equipment: equipmentObj,
				id: props.gymId})
				.then((response) => {    
					Swal.hideLoading();
					Swal.fire({confirmButtonColor: '#3F51B5', title: response.data}).then(okay => {redirectToGym(props.gymId)})
				});
			} catch (error) { console.log(error); alert("Error on Page")}
		}
			} else {
				Swal.fire({confirmButtonColor: '#3F51B5', title: response.data})
			}
			
		})

		
    }

	const DeleteEquip = (index) => {
        const reducedEquip = [...equipment];
        const reducedEquipDetails = [...equipmentDetails];

        reducedEquip.splice(index, 1);
        reducedEquipDetails.splice(index,1);
        setEquipment(reducedEquip);
        setEquipmentDetails(reducedEquipDetails);
    }

	const GetEquip = () => {
		var equip = [];

		for (let i = 0; i < equipment.length; i++) {
			equip.push((<div>
				<Button 
					variant="contained" 
					onClick={() => DeleteEquip(i)}
					size="small"
					style={{left: '-10px'}}
				>
					REMOVE
				</Button>
				<strong >{equipmentMap.get(equipment[i])} : {equipmentDetails[i]}</strong>
				<p></p>

			</div>));
		}
		return (equip);
	}

    const [ownerId, setOwnerId] = useState(props.userId);
	const [isActive, setIsActive] = useState(false);
    const [title, setTitle] = useState("");
    const [street1, setStreet1] = useState("");
	const [street2, setStreet2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [description, setDescription] = useState("");
    const [accessInformation, setAccessInformation] = useState("");
    const [isHostHome, setIsHostHome] = useState('false');
    const [numGuestsAllowed, setNumGuestsAllowed] = useState("1");
    const [photos, setPhotos] = useState(['https://images.pexels.com/photos/4327024/pexels-photo-4327024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1']);
    const [equipment, setEquipment] = useState([]);
    const [equipmentDetails, setEquipmentDetails] = useState([]);
    const [hasBathroom, setHasBathroom] = useState('false');
    const [hasWifi, setHasWifi] = useState('false');
    const [hasSpeakers, setHasSpeakers] = useState('false');
    const [tvType, setTvType] = useState("None");
    const [cost, setCost] = useState(1);
    const [bookingNotice, setBookingNotice] = useState('');
    const [cancelationWarning, setCancelationWarning] = useState('');
    const [availability, setAvailability] = useState([]);
	const [startTimeUTC, setStartTime] = useState(null);
	const [endTimeUTC, setEndTime] = useState(null);
	const [equipmentMap, setEquipmentMap] = useState(new Map());
	const [oldGymLoaded, setOldGymLoaded] = useState(false);
	const [days, setDays] = useState([]);
    const [startingDate, setStartingDate] = useState(null);
    const [startingHours, setStartingHours] = useState(null);
    const [endingHours, setEndingHours] = useState(null);
	const equipMap = new Map();

	if(props.gymId && !oldGymLoaded) {
		Swal.showLoading();
		let str = process.env.REACT_APP_BACKEND_APP + '/api/getGym/' + props.gymId
		Axios.get(str).then((response) => {
			Swal.close();
			if (response.data.get_Gym.isActive) setIsActive(response.data.get_Gym.isActive);
			setDays(response.data.get_Gym.days);
			setStartingDate(dayjs(response.data.get_Gym.startingDate));
			setStartingHours(dayjs(response.data.get_Gym.startingHours));
			setEndingHours(dayjs(response.data.get_Gym.endingHours));
			setTitle(response.data.get_Gym.title);
			setStreet1(response.data.get_Gym.address.street1);
			setStreet2(response.data.get_Gym.address.stree2);
			setCity(response.data.get_Gym.address.City);
			setState(response.data.get_Gym.address.State);
			setZip(response.data.get_Gym.address.zipcode);
			setDescription(response.data.get_Gym.description);
			setAccessInformation(response.data.get_Gym.accessInformation);
			if (response.data.get_Gym.isHostHome)
				setIsHostHome('true');
			setNumGuestsAllowed(response.data.get_Gym.numGuestsAllowed);
			if (response.data.get_Gym.hasBathroom)
				setHasBathroom('true');
			if (response.data.get_Gym.hasWifi)
				setHasWifi('true');
			if (response.data.get_Gym.hasSpeakers)
				setHasSpeakers('true');
			setTvType(response.data.get_Gym.tvType);
			setCost(response.data.get_Gym.cost);
			setBookingNotice(response.data.get_Gym.bookingNotice);
			setCancelationWarning(response.data.get_Gym.cancelationWarning);		
			for (let i = 0; i <response.data.get_Gym.equipment.length; i++) {
				setEquipment(prevState => [...prevState, response.data.get_Gym.equipment[i].equipmentId]);
				setEquipmentDetails(prevState => [...prevState, response.data.get_Gym.equipment[i].details]);
			}
		})
		setOldGymLoaded(true);
	}

	const ReviewDialog = styled(Dialog)(({ theme }) => ({
		'& .MuiDialogContent-root': {padding: theme.spacing(2),},
		'& .MuiDialogActions-root': {padding: theme.spacing(1),},
	}));
	  
	const ReviewDialogTitle = (props) => {
		const { children, onClose, ...other } = props;
		return ( <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? ( <IconButton
				aria-label="close"
				onClick={onClose}
				sx={{
				  position: 'absolute',
				  right: 8,
				  top: 8,
				  color: (theme) => theme.palette.grey[500],
				}}>
			  <CloseIcon />
			  </IconButton>
			) : null}
		</DialogTitle> );
	};
	  
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {setOpen(true);};
	const handleClose = () => {setOpen(false);};

	const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
	const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }
	
	const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }
	if (props.userId) {
	return ( <div className='UploadTab'>
		<Box sx={{bgcolor: 'background.paper',}}>
		<AppBar className='UploadTab-AppBar' position="static" color="default">
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="primary"
				variant="fullWidth"
			>
				<Tab label="General Info" {...a11yProps(0)} />
				<Tab label="Equipment" {...a11yProps(1)} />
                <Tab label="Amenitites" {...a11yProps(2)} />
                <Tab label="Pricing and Availability" {...a11yProps(3)} />
			</Tabs>
		</AppBar>
		<SwipeableViews
			axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
			index={value}
			onChangeIndex={handleChangeIndex}
			style={{width: '100ch', height: '80ch'}}
		>
		  <TabPanel value={value} index={0} dir={theme.direction}>
			<Box sx={{ '& .MuiTextField-root': { m: 1, width: '33ch' }}}>
				<TextField
					required
					id="name"
					label="Gym Name"
					variant="outlined"
					value={(title)}
					onChange={(e) => setTitle(e.target.value)}
					helperText={title === "" ? 'Please enter a gym name.' : ' '}
				/>
				<TextField
					required
					id="description"
					label="Description"
					variant="outlined"
					value={description} 
					onChange={(e) => setDescription(e.target.value)}
					helperText={description === "" ? 'Please enter a description.' : ' '}
				/>
				<TextField
					required
					id="max-guests"
					label="Maximum number of guests?"
					type="number"
					variant="outlined"
					placeholder={'1-100'}
					InputProps={{inputProps: { min: 1 }}}
					value={numGuestsAllowed} 
					onChange={(e) => setNumGuestsAllowed(e.target.value)}
					helperText={numGuestsAllowed === "" || numGuestsAllowed <= 0 ? 'Please enter a number greater than 0' : ' '}
					error={numGuestsAllowed <= 0 || isNaN(numGuestsAllowed)}
				/>
				<TextField
					required
					id="notes"
					label="Access Instructions"
					variant="outlined"
					value={accessInformation} 
					onChange={(e) => setAccessInformation(e.target.value)}
					helperText={accessInformation === "" ? 'Please enter any access instructions.' : ' '}
				/>
				{props.gymId  && isActive ? 
				<TextField
				required
				id="location-street"
				label="Street"
				variant="outlined"
				value={street1} 
				disabled
				helperText={street1 === "" ? 'Please enter your street.' : ' '}
				/>
				: <TextField
					required
					id="location-street"
					label="Street"
					variant="outlined"
					value={street1} 
					onChange={(e) => setStreet1(e.target.value)}
					helperText={street1 === "" ? 'Please enter your street.' : ' '}
				/>}
				{props.gymId && isActive ?
				<TextField
					required
					id="location-city"
					label="City"
					variant="outlined"
					value={city} 
					disabled
					helperText={
						city === "" ? 'Please enter your city.' : ' ' &&
						!isNaN(city) ? 'Not a city.' : ' ' 
					}
					error={!isNaN(city) && city !== ""}
				/>
				: <TextField
				required
				id="location-city"
				label="City"
				variant="outlined"
				value={city} 
				onChange={(e) => setCity(e.target.value)}
				helperText={
					city === "" ? 'Please enter your city.' : ' ' &&
					!isNaN(city) ? 'Not a city.' : ' ' 
				}
				error={!isNaN(city) && city !== ""}
				/>}
				{props.gymId && isActive ? 
				<TextField
					required
					id="location-state"
					label="State"
					variant="outlined"
					value={state} 
					disabled
					helperText={
						state === "" ? 'Please enter your state.' : ' ' &&
						!isNaN(state) ? 'Not a state.' : ' ' 
					}
					error={!isNaN(state) && state !== ""}
				/>
				:
				<TextField
				required
				id="location-state"
				label="State"
				variant="outlined"
				value={state} 
				onChange={(e) => setState(e.target.value)}
				helperText={
					state === "" ? 'Please enter your state.' : ' ' &&
					!isNaN(state) ? 'Not a state.' : ' ' 
				}
				error={!isNaN(state) && state !== ""}
				/>}
				{/* {props.gymId && isActive ? 
				<TextField
					required
					id="location-zip"
					label="Zip"
					variant="outlined"
					value={zip} 
					disabled
					helperText={
						zip === "" ? 'Please enter your zip.' : ' ' &&
						isNaN(zip) ? 'Not a zip.' : ' ' 
					}
					error={isNaN(zip)}
				/>
				:
				<TextField
					required
					id="location-zip"
					label="Zip"
					variant="outlined"
					value={zip} 
					onChange={(e) => setZip(e.target.value)}
					helperText={
						zip === "" ? 'Please enter your zip.' : ' ' &&
						isNaN(zip) ? 'Not a zip.' : ' ' 
					}
					error={isNaN(zip)}
				/>} */}
				<Box sx={{ flexGrow: 1 }}>
				  <Grid>
					<Stack direction="row" spacing={2}>
						<Typography>
							Will You Be At Home?
						</Typography>
						<RadioGroup 
							row 
							value={isHostHome}
							onChange={(e) => setIsHostHome(e.target.value)}
						>
							<FormControlLabel value="true" control={<Radio />} label="YES" />
							<FormControlLabel value="false" control={<Radio />} label="NO" />
						</RadioGroup>
					</Stack>
					<input accept="image/*" type="file" onChange={handleFileInput} />
					<br />
					<br />
					<Button onClick={() => uploadFile(selectedFile)} variant="contained" component="label" startIcon={<PhotoCamera/>}>Upload Picture
					</Button>					
				  </Grid>
				</Box>
			</Box>
		  </TabPanel>
		  <TabPanel value={value} index={1} dir={theme.direction}>
			<SelectEquipment/>
			<Typography variant='h5' color='gray'>Equipment List</Typography>
			{GetEquip()}
				
		  </TabPanel>
		  <TabPanel value={value} index={2} dir={theme.direction}>
			<Stack direction="row" spacing={2}>
			<Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
				Wifi Access 
				<RadioGroup 
					row 
					value={hasWifi}
					onChange={(e) => setHasWifi(e.target.value)}
				>
					<FormControlLabel value="true" control={<Radio />} label="YES" />
					<FormControlLabel value="false" control={<Radio />} label="NO" />
				</RadioGroup>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
				Bathroom Access
				<RadioGroup 
					row 
					value={hasBathroom}
					onChange={(e) => setHasBathroom(e.target.value)}
				>
					<FormControlLabel value="true" control={<Radio />} label="YES" />
					<FormControlLabel value="false" control={<Radio />} label="NO" />
				</RadioGroup>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
				Speaker Access
				<RadioGroup 
					row 
					value={hasSpeakers}
					onChange={(e) => setHasSpeakers(e.target.value)}
				>
					<FormControlLabel value="true" control={<Radio />} label="YES" />
					<FormControlLabel value="false" control={<Radio />} label="NO" />
				</RadioGroup>
			</Box>
			<Box sx={{ minWidth: 120 }}>
				<FormControl><InputLabel>TV</InputLabel>
					<Select
						value={tvType}
						label="TV"
						onChange={(e) => setTvType(e.target.value)}
						sx={{ width: 135 }}
					>
						<MenuItem value={"None"}>None</MenuItem>
						<MenuItem value={"Traditional"}>Traditional</MenuItem>
						<MenuItem value={"Smart"}>Smart</MenuItem>
					</Select>
				</FormControl>
			</Box>
			</Stack>	
		  </TabPanel>
		  <TabPanel value={value} index={3} dir={theme.direction}>
			<Box sx={{ '& .MuiTextField-root': { m: .75, width: '33ch' }}}>
				<AvailabilitySelector 
					gymId={props.gymId}
					days={days}
					setDays={setDays}
					startingDate={startingDate}
					setStartingDate={setStartingDate}
					startingHours={startingHours}
					setStartingHours={setStartingHours}
					endingHours={endingHours}
					setEndingHours={setEndingHours}
					setAvailability={setAvailability}/>
				{/* {availability} */}
				<TextField
					id="hourly-rate"
					label="Hourly Rate?"
					type="number"
					variant="outlined"
					placeholder={'1-100'}
					InputProps={{inputProps: { min: 1, max: 100}}}
					value={cost} 
					onChange={(e) => setCost(e.target.value)}
					helperText={cost === "" || cost <= 0 || cost > 100 ? 'Please enter a number from 1-100' : ' '}
					error={cost <= 0 || cost > 100 || isNaN(cost)}
				/>
				<div>
					<TextField
						required
						id="booking-notice"
						label="Booking Notice? (In hours)"
						variant="outlined"
						value={bookingNotice} 
						onChange={(e) => setBookingNotice(e.target.value)}
						helperText={bookingNotice === "" ? 'Please enter any booking requirements.' : ' '}
					/>
					<TextField
						required
						id="cancel-notice"
						label="Cancelation Notice? (In hours)"
						variant="outlined"
						value={cancelationWarning} 
						onChange={(e) => setCancelationWarning(e.target.value)}
						helperText={cancelationWarning === "" ? 'Please enter any cancelation requirements.' : ' '}
					/>
				</div>
			</Box>		
		  </TabPanel>
		</SwipeableViews>
		{isActive ? 
			<Button variant="contained" onClick={() => SubmitGym()} style={{left: '82%'}}>
				UPDATE GYM
			</Button>
			: <Button variant="contained" onClick={() => SubmitGym()} style={{left: '82%'}}>
				REVIEW GYM
			</Button>}	

		<ReviewDialog onClose={handleClose} open={open}>
			<ReviewDialogTitle onClose={handleClose}>
				Confirm Gym Submission
			</ReviewDialogTitle>
			<DialogContent dividers>
				--General Info--
				<Typography gutterBottom>
					Gym Name: {title}<br/>
					Description: {description}<br/>
					Max Number of Guests Allowed: {numGuestsAllowed}<br/>
					Access Instructions: {accessInformation}<br/>
					Address: {street1} {city} {state} {zip}<br/>
					Gym Owner At Home: {isHostHome === "false" ? "No" : "Yes"}<br/>
				</Typography>
			</DialogContent>
			<DialogContent dividers>
				--Equipment--
				{GetEquip()}
			</DialogContent>
			<DialogContent dividers>
				--Amenities--
				<Typography gutterBottom>
					Wifi: {hasWifi === "false" ? "No" : "Yes"}<br/>
					Bathrooms: {hasBathroom === "false" ? "No" : "Yes"}<br/>
					Speakers: {hasSpeakers === "false" ? "No" : "Yes"}<br/>
					TV Type: {tvType}<br/>
				</Typography>
			</DialogContent>
				<DialogContent dividers>
				--Pricing and Availability--
				<Typography gutterBottom>
					Hourly Rate: ${cost}/hour<br/>
					Starting Availability: {startTimeUTC === null ? '' : JSON.stringify(startTimeUTC)}<br/>
					Ending Availability: {endTimeUTC === null ? '' : JSON.stringify(endTimeUTC)}<br/>
					Booking Notice: {bookingNotice === '' ? '' : bookingNotice + ' hours'}<br/>
					Cancelation Notice: {cancelationWarning === '' ? '' : cancelationWarning + ' hours'}<br/>
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={handleClose}>
					GO BACK
				</Button>
				<Button className="review-submit"
						variant="contained" 
						onClick={() => SubmitGym()}
				>
					SUBMIT GYM
				</Button>
			</DialogActions>
		</ReviewDialog>
	</Box>
	</div>)
	}else{
		return (
		<div></div>
		)}
}

export default UploadTab;