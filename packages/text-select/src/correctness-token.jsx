import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

const CorrectnessToken = props => {
  const { classes } = props;

  const className = classNames(
    classes.custom,
    props.correct === true && classes.correct,
    props.correct === false && classes.incorrect
  );

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: props.text }}
    />
  );
};

CorrectnessToken.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default withStyles(() => ({
  custom: {
    display: 'initial'
  },
  correct: {
    backgroundColor: green[500]
  },
  incorrect: {
    backgroundColor: orange[500]
  }
}))(CorrectnessToken);
