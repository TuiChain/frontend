import React from "react";
import { Card, Grid, Box } from "@material-ui/core/";
import { CardActionArea, CardContent, CardMedia } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { styled } from "@material-ui/core/styles";
import { useWideCardMediaStyles } from "@mui-treasury/styles/cardMedia/wide";
import {
  Home,
  Euro,
  FavoriteBorder,
  Create,
  School,
  Room,
} from "@material-ui/icons";

const StyledCardActionArea = styled(CardActionArea)({
  minWidth: "250px",
  transition: "0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const StyledCard = styled(Card)({
  backgroundColor: "#FCFCFC",
  borderRadius: 16,
  "&:hover": {
    backgroundColor: "transparent",
    boxShadow: "0px 10px 10px 0",
  },
});

const TextContainer = styled(Box)({
  color: "#6D6E7B",
});

const StatusItem = ({ icon: Icon, text }) => {
  return (
    <Grid container item alignItems="center" xs={6}>
      <Grid item xs={3}>
        <Icon />
      </Grid>
      <Grid item xs={9}>
        <TextContainer fontWeight="fontWeightBold">{text}</TextContainer>
      </Grid>
    </Grid>
  );
};

const StudentInfo = ({
  name,
  likes,
  degree,
  course,
  origin,
  university,
  tuition,
}) => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
      </Grid>
      <StatusItem icon={FavoriteBorder} text={likes} />
      <StatusItem icon={School} text={degree} />
      <StatusItem icon={Create} text={course} />
      <StatusItem icon={Room} text={origin} />
      <StatusItem icon={Home} text={university} />
      <StatusItem icon={Euro} text={tuition} />
    </Grid>
  );
};

const StudentCard = ({
  name,
  photo,
  likes,
  degree,
  course,
  origin,
  university,
  tuition,
}) => {
  const styles = useWideCardMediaStyles();

  return (
    <StyledCardActionArea>
      <StyledCard>
        <CardMedia classes={styles} image={photo} />
        <CardContent>
          <StudentInfo
            name={name}
            likes={likes}
            degree={degree}
            course={course}
            origin={origin}
            university={university}
            tuition={tuition}
          />
        </CardContent>
      </StyledCard>
    </StyledCardActionArea>
  );
};

export default StudentCard;

StudentCard.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  likes: PropTypes.string.isRequired,
  degree: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
  tuition: PropTypes.number.isRequired,
};

StudentInfo.propTypes = {
  name: PropTypes.string.isRequired,
  likes: PropTypes.string.isRequired,
  degree: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
  tuition: PropTypes.number.isRequired,
};

StatusItem.propTypes = {
  icon: PropTypes.object.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
