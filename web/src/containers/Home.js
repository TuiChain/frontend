import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const Home = () => {
  return (
    <div>
      <Button variant="contained" color="primary">
        Teste
      </Button>
      <Button variant="contained" color="secondary">
        Teste
      </Button>
      <Button variant="outlined" color="primary" startIcon={<SaveIcon />}>
        Teste
      </Button>
      <Button variant="outlined" color="primary" endIcon={<SaveIcon />}>
        Teste
      </Button>
      <Button color="primary">Teste</Button>
      <Link to="/students/1">
        <div className="student">Student 1</div>
      </Link>
      <Link to="/students/2">
        <div className="student">Student 2</div>
      </Link>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/login"
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/investments"
      >
        Investments
      </Button>
    </div>
  );
};

export default Home;
