import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import StudentCard from '../../components/StudentCard'

const StyledGrid = styled(Grid)({
    paddingLeft: '20%',
    paddingRight: '20%',
});

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((studentList) => {
      setStudents(studentList);
    });
  }, []);

  return (
    <StyledGrid container direction="row" justify="center" alignItems="center" spacing={10}>
      {students.map((student) => {
        return (
        <Grid key={student.id} item xs={12} sm={6} md={4} xl={3} >
            <StudentCard name={student.name} photo={student.photo} description={student.description} />
        </Grid>
        );
      })}
    </StyledGrid>
  );
};

export default Students;
