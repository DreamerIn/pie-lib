import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';

export class Controls extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClear: PropTypes.func.isRequired,
    onWords: PropTypes.func.isRequired,
    onSentences: PropTypes.func.isRequired,
    setCorrectMode: PropTypes.bool.isRequired,
    onToggleCorrectMode: PropTypes.func.isRequired
  };

  static defaultProps = {};

  render() {
    const {
      classes,
      onClear,
      onWords,
      onSentences,
      setCorrectMode,
      onToggleCorrectMode
    } = this.props;
    return (
      <div className={classes.controls}>
        <div>
          <Button
            onClick={onWords}
            className={classes.button}
            size="small"
            color="primary"
            disabled={setCorrectMode}
          >
            Words
          </Button>
          <Button
            onClick={onSentences}
            className={classes.button}
            size="small"
            color="primary"
            disabled={setCorrectMode}
          >
            Sentences
          </Button>
          <Button
            className={classes.button}
            size="small"
            color="secondary"
            onClick={onClear}
            disabled={setCorrectMode}
          >
            Clear
          </Button>
        </div>
        <FormControlLabel
          control={
            <Switch checked={setCorrectMode} onChange={onToggleCorrectMode} />
          }
          label="Set correct answers"
        />
      </div>
    );
  }
}
export default withStyles(theme => ({
  button: {
    marginRight: theme.spacing.unit
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}))(Controls);