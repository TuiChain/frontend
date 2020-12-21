import React from "react";
import Card from "@material-ui/core/Card";
import { CardActionArea, CardContent, CardMedia } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const StudentCard = ({ name, photo, description }) => {
  return (
    <Card>
      <CardActionArea>
        <CardMedia component="img" src={photo} height="200" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StudentCard;

StudentCard.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
