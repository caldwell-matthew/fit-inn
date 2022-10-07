import React, { Component, Fragment, useEffect, useState, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import AdvancedSearchBar from "../components/GymSearch/AdvancedSearchBar";
import {ViewGyms} from "./ViewGym";
import SortingButtons from "../components/GymSearch/SortingButtons";
import { Box, Stack, Typography, Grid } from '@mui/material';

const GET_GYMS = gql(`
  query ListGyms {
    list_GymsItems {
      nextToken
      _GymsItems {
        gymName
        gymAddress
        gymDescription
      }
    }
  }
`);

function GetGyms() {
  const { loading, error, data } = useQuery(GET_GYMS);
  const [gyms, getGyms] = useState([]);
  
  useEffect(() => {
    console.log(data);
    if (data) getGyms(data.list_GymsItems._GymsItems);
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      { gyms.map((val) => {
        return (
          <div>
            Gym Name : {val.gymName} <></>
            Gym Address : {val.gymAddress} <></>
            Gym Description : {val.gymDescription} <></>
          </div>
        )
      })}
    </div>
  )
}

function GymSearchPage  () {

  const [results, setResults] = useState(false);
  
  return (
      <Fragment>
        <div className="gym-searchbar">
          <AdvancedSearchBar setResults = {setResults}/>
        </div>
        <ViewGyms results={results}/>
      </Fragment>
    );
}
export default GymSearchPage;