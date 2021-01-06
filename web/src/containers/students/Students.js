import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import Grid from "@material-ui/core/Grid";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";
import theme from '../../theme';

const StyledGrid = styled(Grid)({
  paddingLeft: "10%",
  paddingRight: "10%",

  [theme.breakpoints.only('sm')]: {
    paddingLeft: "30%",
    paddingRight: "30%",
  },
  [theme.breakpoints.only('xs')]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((studentList) => {
      setStudents(studentList);
    });
  }, []);

  return (
    <>
      <StyledGrid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={10}
      >
        {students.map(
          ({
            id,
            name,
            photo,
            likes,
            degree,
            origin,
            course,
            university,
            tuition,
          }) => {
            return (
              <Grid key={id} item xs={12} md={4} xl={3}>
                <StudentCard
                  name={name}
                  photo={photo}
                  degree={degree}
                  likes={likes}
                  university={university}
                  course={course}
                  origin={origin}
                  tuition={tuition}
                />
              </Grid>
            );
          }
        )}
      </StyledGrid>
    </>
  );
};

export default Students;
