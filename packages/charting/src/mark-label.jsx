import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { GraphPropsType } from '@pie-lib/plot/lib/types';

const styles = theme => ({
  input: {
    float: 'right',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: 'none',
    color: theme.palette.primary.dark
  }
});

export const MarkLabel = props => {
  const [input, setInput] = useState(null);
  const _ref = useCallback(node => setInput(node), null);

  const { mark, classes, disabled, inputRef: externalInputRef, barWidth, rotate } = props;
  const [label, setLabel] = useState(mark.label);
  const onChange = e => setLabel(e.target.value);
  const onChangeProp = e => props.onChange(e.target.value);

  // useState only sets the value once, to synch props to state need useEffect
  useEffect(() => {
    setLabel(mark.label);
  }, [mark.label]);

  return (
    <AutosizeInput
      inputRef={r => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabled}
      inputClassName={cn(classes.input)}
      inputStyle={{
        minWidth: barWidth,
        textAlign: 'center',
        background: 'transparent'
      }}
      value={label}
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        top: 0,
        left: 0,
        minWidth: barWidth,
        transformOrigin: 'left',
        transform: `rotate(${rotate}deg)`
      }}
      onChange={onChange}
      onBlur={onChangeProp}
    />
  );
};

MarkLabel.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  graphProps: GraphPropsType,
  classes: PropTypes.object,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
  barWidth: PropTypes.number,
  rotate: PropTypes.number
};

export default withStyles(styles)(MarkLabel);