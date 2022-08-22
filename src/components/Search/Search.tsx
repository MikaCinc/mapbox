import React, { useCallback, useEffect, useState } from "react";
/* Components */
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import TextField from "@mui/material/TextField/TextField";
import { ISearchOption } from "../../interfaces";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
/* Tools */
import _ from "lodash";
import { Typography } from "@mui/material";

interface ISearchProps {
  handleBuildingData: (building: any) => void;
}

const Search = ({ handleBuildingData }: ISearchProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [options, setOptions] = useState<ISearchOption[]>([]);
  const optionsLoading = open && options.length === 0;

  useEffect(() => {
    if (!searchString) {
      // setOptions([]);
      return;
    }
    filteringFunctions(searchString);
  }, [searchString]);

  const filteringFunctions = useCallback(
    _.debounce(async (searchString) => {
      console.log("inside debouncerrrrr");

      const bySearch = await search(searchString);

      setOptions(bySearch);

      /* setLoadingFilterResults(false); */
    }, 500),
    []
  );

  const search = async (label: string = "Sonnrain 4") => {
    console.log("search", label);

    try {
      const response = await fetch(
        "https://microservices-api.immoledo.app/geo-prod/Geo/Query",
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": "026fe368-64ce-4a2b-8ed5-6d10fbfc9cc8",
            Accept: "*/*",
          },
          body: JSON.stringify({
            text: label,
            maxItemCount: 6,
            type: [6],
          }),
        }
      );
      if (!response.ok) {
        const message = `Kod greške: ${response.status}`;
        throw new Error(message);
      }
      const res = await response.json();
      console.log("search res:", res);
      return res;
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const handleOptionSelected = async (option: ISearchOption) => {
    console.log("handleOptionSelected", option);

    const egId = option.egid;
    if (!egId) {
      return;
    }

    try {
      const response = await fetch(
        `https://microservices-api.immoledo.app/geo-prod/Geo/Buildings/ByEgid/${egId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": "026fe368-64ce-4a2b-8ed5-6d10fbfc9cc8",
            Accept: "*/*",
          },
        }
      );
      if (!response.ok) {
        const message = `Kod greške: ${response.status}`;
        throw new Error(message);
      }
      const res = await response.json();
      console.log("building res:", res);
      if (!res || !res.id) throw new Error("Error fetching building");
      handleBuildingData(res);
      return res;
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  return (
    <div className="searchContainer">
      <Autocomplete
        disablePortal
        id="searchAutoComplete"
        options={options}
        sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        clearOnBlur={false}
        onChange={(event, value) => {
          if (value && typeof value === "object") {
            handleOptionSelected(value);
          }
        }}
        freeSolo
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;

          return (
            new DOMParser().parseFromString(option.highlight, "text/html")
              .documentElement.textContent || ""
          );
        }}
        /* renderOption={(props, option) => (
          <Typography>
            {new DOMParser().parseFromString(option.highlight, "text/html")
              .documentElement.textContent || ""}
          </Typography>
        )} */
        loading={optionsLoading}
        isOptionEqualToValue={(option, value) => option.egid === value.egid}
        filterOptions={(x) => x}
        onInputChange={(event, newInputValue) => {
          // if (event.type === "blur" || event.type === "click") return;
          setSearchString(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {optionsLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};
export default Search;
