import React from "react";
import { Card, Grid, Box } from "@material-ui/core/";
import { CardActionArea, CardContent, CardMedia } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { styled, withStyles } from "@material-ui/core/styles";
import { useWideCardMediaStyles } from "@mui-treasury/styles/cardMedia/wide";
import Progress from "../components/Progress";
import DAI from "../components/DAI";
import { Create, School, Room } from "@material-ui/icons";

const StyledCardActionArea = withStyles({
  root: {
    minWidth: "250px",
    transition: "0.2s",
    "&:hover": {
      transform: "scale(1.03)",
    },
    "&:hover $focusHighlight": {
      opacity: 0,
    },
  },
  focusHighlight: {},
})(CardActionArea);

const StyledCard = styled(Card)({
  backgroundColor: "#FCFCFC",
  borderRadius: 16,
  "&:hover": {
    backgroundColor: "transparent",
    boxShadow: "0px 5px 5px 0px",
  },
});

const TextContainer = styled(Box)({
  color: "#6D6E7B",
});

const StatusItem = ({ icon, text }) => {
  return (
    <Grid container item alignItems="center" xs={6}>
      <Grid item xs={3}>
        {icon}
      </Grid>
      <Grid item xs={9}>
        <TextContainer fontWeight="fontWeightBold">{text}</TextContainer>
      </Grid>
    </Grid>
  );
};

const LoanInfo = ({ name, course, school, tuition, destination }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
      </Grid>
      <StatusItem icon={<School />} text={school} />
      <StatusItem icon={<Create />} text={course} />
      <StatusItem icon={<Room />} text={destination} />
      <StatusItem icon={<DAI size={22} />} text={tuition} />
    </Grid>
  );
};

const LoanCard = ({
  name,
  photo,
  course,
  school,
  tuition,
  destination,
  fundedPercentage,
}) => {
  const styles = useWideCardMediaStyles();

  return (
    <StyledCardActionArea>
      <StyledCard>
        <CardMedia classes={styles} image={photo} component="img" />
        <CardContent>
          <LoanInfo
            name={name}
            course={course}
            school={school}
            tuition={tuition}
            destination={destination}
          />
        </CardContent>
      </StyledCard>
      <Box style={{ width: "100%" }}>
        <Progress completed={fundedPercentage} slim />
      </Box>
    </StyledCardActionArea>
  );
};

export default LoanCard;

LoanCard.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  tuition: PropTypes.number.isRequired,
  fundedPercentage: PropTypes.number,
};

LoanInfo.propTypes = {
  name: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  tuition: PropTypes.number.isRequired,
};

StatusItem.propTypes = {
  icon: PropTypes.object.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
