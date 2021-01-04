import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import Grid from "@material-ui/core/Grid";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";

const StyledGrid = styled(Grid)({
  paddingLeft: "20%",
  paddingRight: "20%",
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
              <Grid key={id} item xs={12} md={6} xl={4}>
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
