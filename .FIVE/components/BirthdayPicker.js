import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { View } from "react-native";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

// Needed to get padding right
const CustomDatePicker = styled(MobileDatePicker)({
  "& .MuiOutlinedInput-root": {
    border: "none",
    padding: 0,
    height: 40,
    "& fieldset": {
      border: "none",
      padding: 0,
      paddingLeft: 10,
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
    // TODO: Fix font type
  },
});

export default function BirthdayPicker({ updateProfile, initDate }) {
  const handleChange = (newValue) => {
    const birthday = newValue.format("YYYY-MM-DD");

    // Calculate the age based on the birthday
    const today = dayjs();
    const birthDate = dayjs(birthday);
    let age = today.diff(birthDate, "year");

    // Adjust age if the birthday hasn't occurred yet this year
    if (today.isSameOrBefore(birthDate.add(age, "year"))) {
      age -= 1;
    }

    updateProfile({
      birthday: birthday,
      age: age.toString(),
    });
  };

  return (
    <View>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePicker
          value={initDate ? dayjs(initDate) : null}
          openTo="year"
          views={["year", "month", "day"]}
          closeOnSelect={true}
          disableFuture={true}
          disableHighlightToday={true}
          onAccept={handleChange}
          slotProps={{
            toolbar: {
              hidden: true,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",
              padding: 0,
              height: 40,
              "& fieldset": {
                border: "none",
                padding: 0,
              },
            },
          }}
        />
      </LocalizationProvider>
    </View>
  );
}
